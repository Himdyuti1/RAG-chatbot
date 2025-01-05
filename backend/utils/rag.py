from langchain_community.vectorstores import Chroma
from langchain.text_splitter import TokenTextSplitter
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_cohere import CohereEmbeddings
from langchain.schema import Document
from dotenv import load_dotenv
import os
from chromadb.config import Settings

# Load environment variables
load_dotenv()

class RAG:
    def __init__(self):
        self.embed_model = self.get_embedding_model()
        self.server_url = os.getenv('CHROMA_SERVER_URL')

    def get_embedding_model(self):
        embedding_model = CohereEmbeddings(
            cohere_api_key=os.getenv('COHERE_API_KEY'),
            model='embed-english-v3.0'
        )
        return embedding_model

    def split_docs(self, docs):
        text_splitter = TokenTextSplitter(chunk_size=500, chunk_overlap=20)
        documents = text_splitter.split_documents(docs)
        return documents

    def populate_vector_db(self, collection_name, docs):
        client_settings = Settings(chroma_server_host=self.server_url)
        self.documents = self.split_docs(docs)
        db = Chroma.from_documents(
            documents=self.documents,
            embedding=self.embed_model,
            collection_name=collection_name,
            client_settings=client_settings
        )

    def load_vector_db(self, collection_name):
        client_settings = Settings(chroma_server_host=self.server_url)
        db = Chroma(
            collection_name=collection_name,
            embedding_function=self.embed_model,
            client_settings=client_settings
        )
        return db

    def get_retriever(self, collection_name):
        return self.load_vector_db(collection_name).as_retriever()

    def add_to_history(self, collection_name: str, role: str, content: str):
        client_settings = Settings(chroma_server_host=self.server_url)
        db = Chroma(
            collection_name=f"{collection_name}_history",
            embedding_function=self.embed_model,
            client_settings=client_settings,
        )
        document = Document(
            page_content=content,
            metadata={"role": role, "collection_name": collection_name}
        )
        db.add_documents([document])

    def get_history(self, collection_name: str):
        client_settings = Settings(chroma_server_host=self.server_url)
        db = Chroma(
            collection_name=f"{collection_name}_history",
            embedding_function=self.embed_model,
            client_settings=client_settings,
        )

        # Use `as_retriever` to fetch documents
        retriever = db.as_retriever()
        documents = retriever.get_relevant_documents(query="")  # Fetch all documents

        history = [
            {"role": doc.metadata.get("role", "unknown"), "content": doc.page_content}
            for doc in documents
        ]
        return history
