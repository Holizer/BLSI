from dotenv import load_dotenv
import os

load_dotenv()

CORS = os.getenv("CORS", "")

def get(key: str):
    return os.getenv(key)