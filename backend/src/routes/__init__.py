from fastapi import APIRouter
from .players import player_router
from .teams import team_router

api_router = APIRouter(prefix="/api")
api_router.include_router(player_router)
api_router.include_router(team_router)