from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from database import get_db
from src.services.season_service import SeasonService
from src.schemas.season import (
    SeasonWithWeeks,
    UpdateSeason,
    CreateSeason
)

from src.schemas.stats import (
    TeamStatistic,
    PlayerStatistic,
    SeasonPlaygroundViews,
    PlayerSeasonProgress,
    TeamSeasonProgress,
    SeasonPlayerBestGame
)

seasons_route = APIRouter(prefix="/seasons")

@seasons_route.get("/", response_model=list[SeasonWithWeeks])
async def get_seasons_with_weeks(db: Session = Depends(get_db)):
    return SeasonService(db).get_seasons_with_weeks()


@seasons_route.put("/{season_id}")
async def update_season(
    season_id: int,
    season_data: UpdateSeason,
    db: Session = Depends(get_db)
):
    SeasonService(db).update_season(season_id, season_data)
    return {"message": "Информация о сезоне успешно обновлена"}


@seasons_route.delete("/{season_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_season(
    season_id: int,
    db: Session = Depends(get_db)
):
    SeasonService(db).delete_season(season_id)


@seasons_route.post("/")
async def create_season(
    season_data: CreateSeason,
    db: Session = Depends(get_db)
):
    SeasonService(db).create_season(season_data)
    return {"message": "Информация о сезоне успешно обновлена"}


#region STATS

# PLAYER STATS
@seasons_route.get("/get-players-statistic", response_model=list[PlayerStatistic])
async def get_players_statistics(
    season_id: int = Query(None),
    week_ids: list[int] = Query(None),
    db: Session = Depends(get_db)
):
    return SeasonService(db).get_players_statistic(season_id, week_ids or [])

@seasons_route.get("/get-season-players-best-game", response_model=list[SeasonPlayerBestGame])
async def get_season_players_best_game(
    season_id: int = Query(None),
    db: Session = Depends(get_db)
):
    return SeasonService(db).get_season_players_best_game(season_id)

@seasons_route.get("/get-players-season-progress", response_model=list[PlayerSeasonProgress])
async def get_players_season_progress(
    first_season_id: int = Query(..., description="ID первого сезона"),
    second_season_id: int = Query(..., description="ID второго сезона"),
    db: Session = Depends(get_db)
):
    return SeasonService(db).get_players_season_progress(
        first_season_id=first_season_id,
        second_season_id=second_season_id,
    )

# TEAM STATS
@seasons_route.get("/get-teams-statistic", response_model=list[TeamStatistic])
async def get_teams_statistic(
    season_id: int = Query(None),
    week_ids: list[int] = Query(None),
    db: Session = Depends(get_db)
):
    return SeasonService(db).get_teams_statistic(season_id, week_ids or [])

@seasons_route.get("/get-teams-season-progress", response_model=list[TeamSeasonProgress])
async def get_teams_season_progress(
    first_season_id: int = Query(..., description="ID первого сезона"),
    second_season_id: int = Query(..., description="ID второго сезона"),
    db: Session = Depends(get_db)
):
    return SeasonService(db).get_teams_season_progress(
        first_season_id=first_season_id,
        second_season_id=second_season_id,
    )
    
# PLAYGROUND STATS
@seasons_route.get("/get-season-playground-views", response_model=list[SeasonPlaygroundViews])
async def get_season_playground_views(
    season_id: int = Query(None),
    week_ids: list[int] = Query(None),
    db: Session = Depends(get_db)
):
    return SeasonService(db).get_season_playground_views(season_id, week_ids)

#endregion