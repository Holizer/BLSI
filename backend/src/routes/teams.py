from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.services.team_service import TeamService
from src.schemas.team import (
    TeamUpdateSchema,
    CreateTeamSchema
)
from database import get_db

team_router = APIRouter(prefix="/teams")

@team_router.get("/teams-list")
async def get_team_list(db: Session = Depends(get_db)):
    return TeamService(db).get_teams()

@team_router.get("/teams-captain-coach")
async def get_teams_captain_coach(db: Session = Depends(get_db)):
    return TeamService(db).get_teams_captain_coach()

@team_router.delete("/{team_id}")
async def delete_team(team_id: int, db: Session = Depends(get_db)):
    TeamService(db).delete_team(team_id)
    return {"message": f"Команда успешно удалена!"}

@team_router.post("/")
async def create_team(team_data: CreateTeamSchema, db: Session = Depends(get_db)):
    try:
        TeamService(db).create_team(team_data.team_name)
        return {"message": f"Команда '{team_data.team_name}' успешно создана!"}
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@team_router.put("/{team_id}")
async def update_team(team_id: int, team_data: TeamUpdateSchema, db: Session = Depends(get_db)):
    try:
        TeamService(db).update_team(team_id, team_data)
        return {"message": f"Команда успешно обновлена!"}
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )