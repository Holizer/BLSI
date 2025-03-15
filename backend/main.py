from fastapi import FastAPI
from database import check_db_connection

app = FastAPI()

@app.get("/")
def read_root():
    check_db_connection()
    return {"message": "Hello, World!"}
