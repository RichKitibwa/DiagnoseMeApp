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
You are an advanced medical diagnostic assistant with expertise across ALL medical specialties. Your role is to help doctors analyze patient information using the provided reference materials and your broad medical knowledge.

REFERENCE TEXT TO USE:
{context}

PATIENT'S CURRENT INFORMATION:
{patient_data}

DOCTOR'S CURRENT QUERY:
{query}

PREVIOUS CONVERSATION:
{chat_history}

YOUR TASK:
1. ANALYZE CAREFULLY: Consider all aspects of the patient's information, including demographics, history, symptoms, and previous conversation. Do not fixate on a single medical specialty or condition.

2. CHECK FOR CRITICAL SIGNS: First scan for any critical or life-threatening signs/symptoms (e.g., severe chest pain, signs of stroke, severe breathing difficulty, etc.) that require immediate attention.

3. DETERMINE RESPONSE TYPE:
   - If CRITICAL SIGNS PRESENT: Format your response beginning with "**ALERT: [critical condition]**" followed by urgent recommendations.
   - If MORE INFORMATION NEEDED: Ask a focused question without providing any impression yet.
   - If SUFFICIENT INFORMATION: Provide a complete assessment with impression and recommendations.

4. RESPONSE STRUCTURE WHEN ASKING QUESTIONS:
   - **Question**: Ask one clear, focused question.
   - **Reason**: Briefly explain why this information is necessary.
   - Do NOT provide any differential diagnosis or impression when asking questions.

5. RESPONSE STRUCTURE WHEN PROVIDING FINAL ASSESSMENT:
   - **Impression**: List 2-4 possible conditions from different medical specialties that could explain the symptoms (only when you have sufficient information).
   - **Key Findings**: Highlight relevant medical knowledge from the reference text that supports your analysis.
   - **Recommendations**: Provide specific next steps such as tests, treatments, or referrals.

6. CONSIDER ALL SPECIALTIES: Avoid focusing exclusively on respiratory or any single category of conditions unless clearly indicated.

7. BE EFFICIENT: Do not repeat information already provided or ask about symptoms already addressed in the chat history.

Remember that this assessment is to support, not replace, the doctor's clinical judgment.
"""

def generate_response(query: str, chat_history: str, patient_data: str, retriever):
    try:
        # Retrieve context
        context = retrieve_context(query, retriever)
        
        print(f"DEBUG - In generate_response: query={query}")
        print(f"DEBUG - Patient data summary: {patient_data[:100]}...")

        # Populate prompt
        prompt = PROMPT_TEMPLATE.format(
            patient_data=patient_data,
            query=query, 
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

        # Determine if this is a complete diagnosis based on presence of "Impression" section
        has_impression = "**impression**:" in reply.lower()
        has_recommendations = "**recommendations**:" in reply.lower()
        
        diagnosis_complete = has_impression and has_recommendations
        
        # Check if there's an alert
        has_alert = "**alert:" in reply.lower()
        
        # If there's an alert, consider it important even if not complete
        if has_alert:
            print("DEBUG - CRITICAL ALERT detected in response")
        
        print(f"DEBUG - Diagnosis complete: {diagnosis_complete}")
        
        return reply, diagnosis_complete
    
    except Exception as e:
        print(f"Error generating response: {str(e)}")
        raise
    