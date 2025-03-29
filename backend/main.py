from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import api_router
import uvicorn

app = FastAPI()
app.include_router(api_router)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run("main:app", port=5000, reload=True)