import boto3 
import logging
import json
import urllib3
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# slack webhook

def send_slack_notification(message):
    http = urllib3.PoolManager()
    data = {
        "text": message
    }
    response = http.request(
        "POST",
        SLACK_WEBHOOK_URL,
        body=json.dumps(data),
        headers={"Content-Type": "application/json"}
    )
    return response

def stop_all_running_instances():
    logger.info("Initialising ec2 client..")
    ec2 = boto3.client('ec2')  # Initialize EC2 client to interact with the EC2 service
    logger.info("EC2 client initialized")

    instances_to_stop = []
    instances_skipped = []
    paginator = ec2.get_paginator('describe_instances')

    try:
        for page in paginator.paginate(Filters=[{'Name': 'instance-state-name', 'Values': ['running']}]):
            for reservation in page['Reservations']:
                for instance in reservation['Instances']:
                    # Check if instance has a "DoNotStop" tag
                    if not any(tag['Key'] == 'DoNotStop' for tag in instance.get('Tags', [])):
                        instances_to_stop.append(instance['InstanceId'])
                    else:
                        instances_skipped.append(instance['InstanceId'])
                        logger.info(f"Instance {instance['InstanceId']} has DoNotStop tag, skipping")

        if instances_to_stop:
            # If there are running instances, stop them in batches of 20
            for i in range(0, len(instances_to_stop), 20):
                batch = instances_to_stop[i:i + 20]
                ec2.stop_instances(InstanceIds=batch)
                logger.info(f"Stopping instances: {batch}")
        else:
            logger.info("No eligible running instances found to stop")

        # Prepare and send Slack notification
        message = f"EC2 Stop Lambda Execution Summary:\n"
        message += f"Instances stopped: {instances_to_stop}\n"
        message += f"Instances skipped (DoNotStop tag): {instances_skipped}\n"

        send_slack_notification(message)
        logger.info("Slack notification sent")

    except ClientError as e:
        logger.error(f"An error occurred: {e}")
        raise

def lambda_handler(event, context):
    logger.info("Lambda function invoked")
    try:
        stop_all_running_instances()
        logger.info("Lambda function completed successfully")
        return {
            'statusCode': 200,
            'body': 'Instances stopped successfully'
        }
    except Exception as e:
        logger.error(f"Lambda function failed: {e}")
        return {
            'statusCode': 500,
            'body': f'Error occurred: {str(e)}'
        }
        
#uncomment this to run the command locally outside of lambda
#stop_all_running_instances()
