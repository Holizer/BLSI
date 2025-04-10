from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from src.services.player_service import PlayerService
from src.schemas.views import PlayerTeamSchema
from src.schemas.player import (
    CreatePlayerSchema,
    PlayerStatistics,
)
from database import get_db

players_router = APIRouter(prefix="/players")


@players_router.get("/get-player-team", response_model=list[PlayerTeamSchema])
async def get_player_team(db: Session = Depends(get_db)):
    return PlayerService(db).get_player_team()

@players_router.get("/get-player-statistics", response_model=list[PlayerStatistics])
async def get_player_statistics(
    season_id: int = Query(None, description="ID сезона для статистики игроков"),
    week_ids: list[int] = Query(None, description="Список ID недель для статистики игроков"),
    db: Session = Depends(get_db)
):
    return PlayerService(db).get_player_statistics(season_id, week_ids or [])


@players_router.put("/update-player-team/{player_id}")
async def update_player_team(player_data: PlayerTeamSchema, db: Session = Depends(get_db)):
    try:
        PlayerService(db).update_player_team(player_data)
        return {"message": f"Игрок {player_data.player_id} успешно обовлен!"}
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@players_router.post("/create-player")
async def create_player(player_data: CreatePlayerSchema, db: Session = Depends(get_db)):
    try:
        PlayerService(db).create_player(player_data)
        return {"message": f"Игрок '{player_data.first_name}' успешно создан!"}
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@players_router.delete("/delete/{player_id}")
async def delete_player(player_id: int, db: Session = Depends(get_db)):
    PlayerService(db).delete_player(player_id)
    return {"message": f"Команда успешно удалена!"}