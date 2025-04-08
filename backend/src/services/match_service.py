from sqlalchemy.orm import Session
from src.repositories.matches_repository import MatchRepository
from sqlalchemy.exc import SQLAlchemyError
from src.schemas.match import (
    ScheduledMatch,
    MatchStatusType
)

from fastapi import HTTPException

class MatchService:
    def __init__(self, db: Session):
        self.repository = MatchRepository(db)

    def get_scheduled_matches(self) -> list[ScheduledMatch]:
        try:
            return self.repository.get_scheduled_matches()
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise HTTPException(
                status_code=400,
                detail=f"Ошибка базы данных при получении данных: {error_msg}"
            )
    
    def get_match_status_types(self) -> list[MatchStatusType]:
        try:
            return self.repository.get_match_status_types()
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise HTTPException(
                status_code=400,
                detail=f"Ошибка базы данных при получении данных: {error_msg}"
            )