from sqlalchemy.orm import Session
from src.repositories.cancellation_reasons_repository import CancellationReasonsRepository
from sqlalchemy.exc import SQLAlchemyError
from src.schemas.cancellation_reasons import (
    CreateCancellationReasons,
    UpdateCancellationReasons,
    CancellationReasons,
)
from fastapi import HTTPException

class СancellationReasonsService:
    def __init__(self, db: Session):
        self.repository = CancellationReasonsRepository(db)

    def get_cancellation_reasons(self) -> list[CancellationReasons]:
        try:
            return self.repository.get_cancellation_reasons()
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise HTTPException(
                status_code=400,
                detail=f"Ошибка базы данных при получении типов площадок: {error_msg}"
            )

    def create_cancellation_reason(self, cancellation_reason_data: CreateCancellationReasons) -> None:
        try:
            self.repository.create_playground(cancellation_reason_data)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise HTTPException(
                status_code=400,
                detail=f"Ошибка базы данных при создании площадки: {error_msg}"
            )


    def update_cancellation_reason(self, cancellation_reason_id: int, cancellation_reason_data: UpdateCancellationReasons) -> None:
        try:
            self.repository.update_cancellation_reason(cancellation_reason_id, cancellation_reason_data)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise HTTPException(
                status_code=400,
                detail=f"Ошибка базы данных при обновлении площадки: {error_msg}"
            )
    


    def delete_cancellation_reason(self, cancellation_reason_id: int) -> None:
        try:
            self.repository.delete_cancellation_reason(cancellation_reason_id)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise HTTPException(
                status_code=400,
                detail=f"Ошибка базы данных при удалении площадки: {error_msg}"
            )