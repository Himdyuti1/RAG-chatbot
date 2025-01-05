from langchain.schema import Document
from io import BytesIO
import fitz  # PyMuPDF
from utils.rag import RAG

def upload_pdf_to_collection(collection_name, pdf_contents):
    rag = RAG()
    documents = []

    # Process each PDF file
    for filename, content in pdf_contents:
        pdf_stream = BytesIO(content)  # Create a stream from the file bytes

        # Extract text using PyMuPDF
        pdf_document = fitz.open(stream=pdf_stream, filetype="pdf")
        for page_num in range(len(pdf_document)):
            page = pdf_document[page_num]
            text = page.get_text("text")
            metadata = {"filename": filename, "page_number": page_num + 1}
            documents.append(Document(page_content=text, metadata=metadata))
        
        pdf_document.close()

    # Populate the vector database
    rag.populate_vector_db(collection_name, documents)
