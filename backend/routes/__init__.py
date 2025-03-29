from fastapi import APIRouter
from .players import players

api_router = APIRouter(prefix="/api")
api_router.include_router(players, prefix="/players")