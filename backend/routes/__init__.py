from fastapi import APIRouter
from .users import users

api_router = APIRouter(prefix="/api")
api_router.include_router(users, prefix="/users")