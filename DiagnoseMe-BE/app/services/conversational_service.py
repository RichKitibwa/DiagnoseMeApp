import os
import openai
from app.services.vectordb_service import retrieve_context
from dotenv import load_dotenv
from typing import Dict
from openai import OpenAI

load_dotenv()

# get openai API key
api_key = os.getenv("OPENAI_API_KEY") 
client = OpenAI(api_key=api_key)

PROMPT_TEMPLATE = """
You are a highly skilled, experienced medical doctor trained to assist another doctor by analyzing patient information using ONLY the provided reference materials.

REFERENCE TEXT TO USE:
{context}

PATIENT'S CURRENT INFORMATION:
{patient_data}

PREVIOUS CONVERSATION:
{chat_history}

YOUR TASK:
1. Analyze the information provided and decide if additional details are needed:
   - **If more information is needed**:
     - Ask a single, clear, and relevant follow-up question.
     - Briefly explain why this information is important.
   - **If sufficient information is available (no further questions needed)**:
     - Provide a concise preliminary assessment.
     - Highlight key findings from the reference text in bullet points (avoid unnecessary repetition).
     - Recommend appropriate next steps, such as tests or treatments, in a clear and actionable manner.

2. Do not suggest **Next Steps** until all relevant questions have been asked and answered. You can ask a maximum of 6 follow-up questions before concluding.

3. Keep responses concise and professional:
   - Avoid restating patient details unnecessarily.
   - Use plain language with minimal repetition.
   - Do not overemphasize "according to the reference text." Implicitly ground all responses in the reference text without explicitly repeating this phrase.

4. Avoid generic or verbose explanations:
   - Focus on actionable insights, rationale, or specific follow-up steps.
   - Responses should flow naturally and simulate a professional conversation.

5. Ensure that every response is structured as follows:
   - **Assessment** (if applicable): A brief summary of the patient's condition.
   - **Key Findings**: Briefly highlight 2-3 relevant points from the reference text.
   - **Question** (if applicable): if more iformation is needed, ask a single, clear, and relevant follow-up question and briefly explain why it is important.
   - **Next Steps** (only if no further questions are needed): Provide specific actions or recommendations.      

Remember:
- Never make suggestions or provide information not supported by the reference text.
- Avoid redundant explanations or overuse of patient details.
- Don't ask for information that was already provided.
- Ensure conversational flow naturally leads to conclusions after 6 follow-up questions.
- Include a clear statement that this is to support, not replace, the doctor's clinical judgment at the end.

"""

def generate_response(query: str, chat_history: str, patient_data: str, retriever):
    try:
        # Retrieve context
        context = retrieve_context(query, retriever)

        # Check if maximum questions have been asked
        # if questions_asked >= 6:
        #     chat_history += "\nThe model has gathered sufficient information. No more questions are needed."

        # Populate prompt
        prompt = PROMPT_TEMPLATE.format(
            patient_data=patient_data,
            context=context,
            chat_history=chat_history or "No previous conversation",
        )

        # Generate model response
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "system", "content": prompt}],
            temperature=0.4,
        )    

        reply = response.choices[0].message.content

        # is_asking_question = "Question:" in reply and "Next Steps:" not in reply

        # if is_asking_question:
        #     questions_asked += 1

        # Check for diagnosis completion
        # diagnosis_complete = not is_asking_question

        diagnosis_keywords = ["diagnosis:", "recommend:", "suggest:", "assessment:"]
        diagnosis_complete = any(keyword in reply.lower() for keyword in diagnosis_keywords)
        
        return reply, diagnosis_complete
    
    except Exception as e:
        print(f"Error generating response: {str(e)}")
        raise
    