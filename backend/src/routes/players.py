from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.services.player_service import PlayerService
from src.schemas.views import PlayerTeamModel
from database import get_db

player_router = APIRouter(prefix="/players")


@player_router.get("/player_team")
async def get_captains(db: Session = Depends(get_db)):
    return PlayerService(db).get_player_team()

@player_router.put("/update_player_team/{player_id}")
async def update_player_team(player_data: PlayerTeamModel, db: Session = Depends(get_db)):
    player_id = player_data.player_id
    first_name = player_data.first_name
    last_name = player_data.last_name
    team_id = player_data.team_id
    print(player_data) 
    PlayerService(db).update_player_team(player_id, first_name, last_name, team_id)
    return {"message": f"Игрок {player_data.player_id} успешно обовлен!"}

# @player_router.put("/update_player_team/{player_id}")
# async def update_player_team(player_id: int, first_name: str, last_name: str, team_id: int, db: Session = Depends(get_db)):
  
#     print(player_id, first_name, last_name, team_id) 
#     # PlayerService(db).update_player_team(player_id, first_name, last_name, team_id)
#     return {"message": f"Игрок {player_id} успешно обовлен!"}