from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import Player 
from database import get_db  

users = APIRouter()

@users.get("/")
async def get_users(db: Session = Depends(get_db)):
    players = db.query(Player).all()
    players_list = [player.__dict__ for player in players]
    
    for player in players_list:
        player.pop('_sa_instance_state', None)

    return {"users": players_list}