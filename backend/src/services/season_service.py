from sqlalchemy.orm import Session
from src.repositories.season_repository import SeasonRepository
from sqlalchemy.exc import SQLAlchemyError
from src.schemas.season import (
    SeasonWithWeeks,
    TeamSeasonStats,
)

from fastapi import HTTPException

class SeasonService:
    def __init__(self, db: Session):
        self.repository = SeasonRepository(db)

    def get_seasons_with_weeks(self) -> list[SeasonWithWeeks]:
        try:
            return self.repository.get_seasons_with_weeks()
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise HTTPException(
                status_code=400,
                detail=f"Ошибка базы данных при получении данных: {error_msg}"
            )
        
        
    def get_team_season_stats(self, team_id: int) -> list[TeamSeasonStats]:
        try:
            return self.repository.get_team_season_stats(team_id)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise HTTPException(
                status_code=400,
                detail=f"Ошибка базы данных при получении данных: {error_msg}"
            )
        
    def get_all_teams_season_stats(self, season_id: int = None, week_id: int = None) -> list[TeamSeasonStats]:
        try:
            return self.repository.get_all_teams_season_stats(season_id, week_id)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise HTTPException(
                status_code=400,
                detail=f"Ошибка базы данных при получении данных: {error_msg}"
            )
   