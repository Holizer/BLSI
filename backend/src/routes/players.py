from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.services.player_service import PlayerService
from src.schemas.views import UpdatePlayerTeamSchema
from src.schemas.views import PlayerTeamSchema
from database import get_db

players_router = APIRouter(prefix="/players")

@players_router.get("/get-player-team")
async def get_player_team(db: Session = Depends(get_db)):
    return PlayerService(db).get_player_team()

@players_router.put("/update-player-team/{player_id}")
async def update_player_team(player_data: PlayerTeamSchema, db: Session = Depends(get_db)):
    try:
        # PlayerService(db).update_player_team(player_data)
        return {"message": f"Игрок {player_data.player_id} успешно обовлен!"}
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@players_router.delete("/delete/{player_id}")
async def delete_player(player_id: int, db: Session = Depends(get_db)):
    PlayerService(db).delete_player(player_id)
    return {"message": f"Команда успешно удалена!"}

# @player_router.put("/update_player_team/{player_id}")
# async def update_player_team(player_id: int, first_name: str, last_name: str, team_id: int, db: Session = Depends(get_db)):
  
#     print(player_id, first_name, last_name, team_id) 
#     # PlayerService(db).update_player_team(player_id, first_name, last_name, team_id)
#     return {"message": f"Игрок {player_id} успешно обовлен!"}