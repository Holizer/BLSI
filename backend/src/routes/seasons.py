from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from src.services.season_service import SeasonService
from src.schemas.season import (
    SeasonWithWeeks,
    TeamSeasonStats
)
seasons_route = APIRouter(prefix="/seasons")

@seasons_route.get("/", response_model=list[SeasonWithWeeks])
async def get_seasons_with_weeks(db: Session = Depends(get_db)):
    return SeasonService(db).get_seasons_with_weeks()

@seasons_route.get("/team-season-stats/{team_id}", response_model=list[TeamSeasonStats])
async def get_team_season_stats(team_id: int, db: Session = Depends(get_db)):
    return SeasonService(db).get_team_season_stats(team_id)

@seasons_route.get("/teams-season-stats/", response_model=list[TeamSeasonStats])
async def get_all_teams_season_stats(
    season_id: int = Query(None),
    week_id: int = Query(None),
    db: Session = Depends(get_db)
):
    return SeasonService(db).get_all_teams_season_stats(season_id, week_id)