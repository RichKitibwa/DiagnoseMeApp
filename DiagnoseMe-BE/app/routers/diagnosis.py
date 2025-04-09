from fastapi import APIRouter, HTTPException, Depends
from app.services.conversational_service import generate_response
from app.services.vectorstore_manager import get_vectorstore
from app.schemas import DiagnosisInput, DiagnosisResponse
import json

# Initialize router
router = APIRouter()

def get_retriever():
    vectorstore = get_vectorstore()
    # Increase k to get more diverse results
    retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 5})
    return retriever

@router.post("/diagnose", response_model=DiagnosisResponse)
async def diagnose(data: DiagnosisInput, retriever=Depends(get_retriever)):
    try:
        # Format patient demographic data as a string
        patient_data_str = ""
        for key, value in data.patient_data.items():
            patient_data_str += f"{key}: {value}\n"
        
        query = data.query
        
        print(f"DEBUG - Patient data: {json.dumps(data.patient_data, indent=2)}")
        print(f"DEBUG - Doctor's query: {query}")
        print(f"DEBUG - Chat history: {data.chat_history}")
        
        # Create formatted chat history
        formatted_chat_history = data.chat_history if data.chat_history else ""

        response, diagnosis_complete = generate_response(
            query=query,
            chat_history=formatted_chat_history,
            patient_data=patient_data_str,
            retriever=retriever
        )

        # Update chat history with the new information
        if formatted_chat_history:
            updated_chat_history = f"{formatted_chat_history}\nDoctor: {query}\nModel: {response}"
        else:
            updated_chat_history = f"Doctor: {query}\nModel: {response}"

        # Print response for debugging
        print(f"DEBUG - Model response: {response[:100]}...")
        print(f"DEBUG - Diagnosis complete: {diagnosis_complete}")

        return DiagnosisResponse(
            model_response=response,
            diagnosis_complete=diagnosis_complete,
            updated_chat_history=updated_chat_history,
        )
    except Exception as e:
        print(f"ERROR in diagnosis endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
