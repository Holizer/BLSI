import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import api_router

app = FastAPI()
app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "API работает!"}

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True)