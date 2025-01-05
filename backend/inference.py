from utils.llm import LLM
from utils.rag import RAG
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

def predict_rag(collection_name, question: str, history=None):
    llm = LLM().get_llm()
    retriever = RAG().get_retriever(collection_name)
    
    # Retrieve conversation history
    rag = RAG()
    conversation_history = rag.get_history(collection_name)
    history_prompt = "\n".join([f"{h['role']}: {h['content']}" for h in conversation_history])

    # Template for the LLM
    template = """
    Answer the question based on the context, in a concise manner and in markdown format.

    History:
    {history}

    Context:
    {context}

    Question: {question}

    Answer:
    """

    prompt = ChatPromptTemplate.from_template(template)

    # Retrieve relevant documents
    retrieved_docs = retriever.get_relevant_documents(question)
    context = "\n".join([doc.page_content for doc in retrieved_docs])

    # Prepare citations from document metadata
    if retrieved_docs:
        citations = [
            f"Source: {doc.metadata.get('filename', 'unknown')} (Page: {doc.metadata.get('page_number', 'N/A')})"
            for doc in retrieved_docs
        ]
        citation_text = "\n".join(citations)
    else:
        citation_text = "No citations found."

    # Create the input for the retrieval chain
    retrieval_chain = (
        {
            "history": RunnablePassthrough(),
            "context": RunnablePassthrough(),
            "question": RunnablePassthrough(),
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    # Combine history, context, and question
    result = retrieval_chain.invoke({
        "history": history_prompt,
        "context": context,
        "question": question,
    })

    # Append the AI's response to history
    rag.add_to_history(collection_name, "user", question)
    rag.add_to_history(collection_name, "ai", result.strip())

    # Append citations to the response
    final_response = f"{result.strip()}\n\n### Citations:\n{citation_text}"
    return final_response
