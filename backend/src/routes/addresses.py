from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.services.player_service import PlayerService
from src.schemas.views import PlayerTeamSchema
from database import get_db

addresses_router = APIRouter(prefix="/addresses")

# @player_router.get("/get-player-team")
# async def get_player_team(db: Session = Depends(get_db)):
#     return PlayerService(db).get_player_team()