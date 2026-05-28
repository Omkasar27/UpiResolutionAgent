import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY        = os.getenv("GROQ_API_KEY")
DATABASE_PATH       = "dispute_agent.db"
JWT_SECRET_KEY      = os.getenv("JWT_SECRET_KEY", "dev-secret-key")
GOOGLE_CLIENT_ID    = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET= os.getenv("GOOGLE_CLIENT_SECRET")
FRONTEND_URL        = os.getenv("FRONTEND_URL", "http://localhost:5173")