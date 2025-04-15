from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from src.services.season_service import SeasonService
from src.schemas.season import (
    SeasonWithWeeks,
    TeamStatistic,
    PlayerStatistic,
    SeasonPlaygroundViews,
    SeasonPlayerBestGame
)
seasons_route = APIRouter(prefix="/seasons")

@seasons_route.get("/", response_model=list[SeasonWithWeeks])
async def get_seasons_with_weeks(db: Session = Depends(get_db)):
    return SeasonService(db).get_seasons_with_weeks()

@seasons_route.get("/get-players-statistic", response_model=list[PlayerStatistic])
async def get_players_statistics(
    season_id: int = Query(None),
    week_ids: list[int] = Query(None),
    db: Session = Depends(get_db)
):
    return SeasonService(db).get_players_statistic(season_id, week_ids or [])


@seasons_route.get("/get-teams-statistic", response_model=list[TeamStatistic])
async def get_teams_statistic(
    season_id: int = Query(None),
    week_ids: list[int] = Query(None),
    db: Session = Depends(get_db)
):
    return SeasonService(db).get_teams_statistic(season_id, week_ids or [])


@seasons_route.get("/get-season-players-best-game", response_model=list[SeasonPlayerBestGame])
async def get_season_players_best_game(
    season_id: int = Query(None),
    db: Session = Depends(get_db)
):
    return SeasonService(db).get_season_players_best_game(season_id)

@seasons_route.get("/get-season-playground-views", response_model=list[SeasonPlaygroundViews])
async def get_season_playground_views(
    season_id: int = Query(None),
    week_ids: list[int] = Query(None),
    db: Session = Depends(get_db)
):
    return SeasonService(db).get_season_playground_views(season_id, week_ids)