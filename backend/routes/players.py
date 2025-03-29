from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import Player 
from database import get_db  
from sqlalchemy import text 

players = APIRouter()

@players.get("/captains")
async def get_captains(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM get_player_team()"))
    captains = [dict(row) for row in result.mappings()]
    return captains