from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import Player 
from database import get_db  

users = APIRouter()

@users.get("/")
async def get_users(db: Session = Depends(get_db)):
    players = db.query(Player).all()
    players_list = [{"playerid": player.playerid, "firstname": player.firstname, "lastname": player.lastname} for player in players]
    return {"users": players_list}
