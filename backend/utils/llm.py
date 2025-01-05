from dotenv import load_dotenv
import os
from langchain_cohere import ChatCohere

class LLM:
    def __init__(self):
        load_dotenv()  # Load environment variables from .env file
        self.cohere_api_key = os.getenv('COHERE_API_KEY')  # Fetch the API key from environment

    def get_llm(self) -> ChatCohere:
        llm = ChatCohere(
            cohere_api_key=self.cohere_api_key,
            model="command-xlarge-nightly",  # Specify a valid Cohere chat model
            temperature=0.7,  # Adjust as needed
            max_tokens=1000,  # Adjust as needed
        )
        return llm
