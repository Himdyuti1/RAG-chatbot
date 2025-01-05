# **RAG-Chatbot**

This project contains two main components:  
1. **Backend**: A FastAPI-based backend for handling ingestion, inference, and LLM-related tasks.  
2. **Frontend**: A React application created using Vite to provide the user interface.

---

## **Table of Contents**
1. [Clone the Repository](#clone-the-repository)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
5. [File Structure](#file-structure)
6. [Troubleshooting](#troubleshooting)

---

## **Clone the Repository**
Start by cloning the repository to your local machine:

```bash
git clone https://github.com/Himdyuti1/RAG-chatbot.git
cd Rag-chatbot
```

## **Prerequisites**

Before you begin, ensure you have the following installed on your system:

1. **Python 3.8+**  
   - Download and install from [python.org](https://www.python.org/downloads/).  
   - Verify installation:  
     ```bash
     python --version
     ```
     or  
     ```bash
     python3 --version
     ```

2. **Node.js 16+**  
   - Download and install from [nodejs.org](https://nodejs.org/).  
   - Verify installation:  
     ```bash
     node --version
     ```
     and  
     ```bash
     npm --version
     ```

3. **Git**  
   - Download and install from [git-scm.com](https://git-scm.com/).  
   - Verify installation:  
     ```bash
     git --version
     ```

Make sure all these dependencies are correctly installed before proceeding with the setup.

## **Installation**

### **Backend Setup**

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
  ```bash
  python -m venv env
  source env/bin/activate
  ```
3. Install the required dependencies
  ```bash
  pip install -r requirements.txt
  ```
4.	Create and configure a .env file in the backend directory and add the following variables to it:
  ```plaintext
  COHERE_API_KEY=<api-key-here>
  CHROMA_SERVER_URL=<chroma-server-url-here>
  FRONTEND_URL=<frontend-url-here>
  ```
5. Start the server
  ```bash
  uvicorn main:app --reload
  ```
  -	The backend should now be running at http://localhost:8000.


### **Frontend Setup**

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2.	Install the required dependencies:
  ```bash
  npm install
  ```
3. Create and configure a .env file in the backend directory and add the following variables to it:
  ```plaintext
  VITE_BACKEND_URL=<backend-url-here>
  ```
  
4. Run the server
  ```bash
  npm run build
  ```
  - The frontend should be running on http://localhost:5173


## **File Structure**

The project is organized as follows:

```plaintext
root/
├── backend/               # Backend (FastAPI) files
│   ├── __pycache__/        # Compiled Python files
│   ├── env/                # Virtual environment directory
│   ├── utils/              # Utility functions
│   │   ├── llm.py          # LLM-related utilities
│   │   └── rag.py          # RAG-related utilities
│   ├── main.py             # Main FastAPI application file
│   ├── inference.py       # Inference logic
│   ├── ingestion.py       # Data ingestion logic
│   ├── requirements.txt   # Backend dependencies
├── frontend/              # Frontend (React with Vite) files
    ├── node_modules/       # Node.js dependencies
    ├── public/             # Static files (e.g., images, icons)
    ├── src/                # Source code for React app
    ├── eslint.config.js    # ESLint configuration file
    ├── package-lock.json  # npm lock file
    ├── package.json       # Frontend dependencies and scripts
    ├── README.md          # Frontend README file
    ├── vite.config.js     # Vite configuration file
