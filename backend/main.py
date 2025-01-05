from fastapi import FastAPI, File, UploadFile, Form
from typing import List
from fastapi.responses import JSONResponse
from ingestion import upload_pdf_to_collection
from inference import predict_rag
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from utils.rag import RAG
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

origins = [
    os.getenv("FRONTEND_URL)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
)

@app.post("/process_pdfs")
async def process_pdfs(
    collection_name: str = Form(...),
    files: List[UploadFile] = File(...)
):
    try:
        pdf_contents = [(file.filename, await file.read()) for file in files]
        upload_pdf_to_collection(collection_name, pdf_contents)
        return JSONResponse(content={"message": "PDFs processed successfully"}, status_code=200)
    except Exception as e:
        print(f"Error: {e}")
        return JSONResponse(content={"message": str(e)}, status_code=500)

class ChatRequest(BaseModel):
    question: str
    collection_name: str

@app.post("/chat")
def chat(request: ChatRequest):
    question = request.question
    collection_name = request.collection_name
    rag = RAG()

    try:
        # Retrieve the conversation history for the collection
        history = rag.get_history(collection_name)

        # Generate the response using the history
        response = predict_rag(collection_name, question, history)
        response = response.strip()

        # Add the new question and response to the history
        rag.add_to_history(collection_name, "user", question)
        rag.add_to_history(collection_name, "assistant", response)

        return JSONResponse(content={"response": response}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"message": str(e)}, status_code=500)
