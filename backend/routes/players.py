from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from services.player_service import PlayerService
from database import get_db

player_router = APIRouter(prefix="/players")

@player_router.get("/player_team")
async def get_captains(db: Session = Depends(get_db)):
    return PlayerService(db).get_player_team()

# @player_router.get("/captains")
# async def get_captains(db: Session = Depends(get_db)):
#     return PlayerService(db).get_captains()