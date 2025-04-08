from sqlalchemy.orm import Session
from src.repositories.season_repository import SeasonRepository
from sqlalchemy.exc import SQLAlchemyError
from src.schemas.season import (
    SeasonWithWeeks,
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
   