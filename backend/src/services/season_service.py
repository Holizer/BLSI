from sqlalchemy.orm import Session
from src.repositories.season_repository import SeasonRepository
from sqlalchemy.exc import SQLAlchemyError
from src.schemas.season import (
    SeasonWithWeeks,
    TeamStatistic,
    PlayerStatistic,
    SeasonPlaygroundViews,
    SeasonPlayerBestGame
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
        
    def get_players_statistic(self, season_id: int = None, week_ids: list[int] = None) -> list[PlayerStatistic]:
        return self.repository.get_players_statistic(season_id, week_ids)
    

    def get_teams_statistic(self, season_id: int = None, week_ids: list[int] = None) -> list[TeamStatistic]:
        return self.repository.get_teams_statistic(season_id, week_ids)
    
    def get_season_playground_views(self, season_id: int = None, week_ids: list[int] = None) -> list[SeasonPlaygroundViews]:
        return self.repository.get_season_playground_views(season_id, week_ids)
    
    def get_season_players_best_game(self, season_id: int = None) -> list[SeasonPlayerBestGame]:
        return self.repository.get_season_players_best_game(season_id)