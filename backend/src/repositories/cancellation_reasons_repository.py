from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.sql import text
from src.schemas.cancellation_reasons import (
    CreateCancellationReasons,
    CancellationReasons,
)


class CancellationReasonsRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_cancellation_reasons(self):
        query = text("SELECT * FROM get_cancellation_reasons()")  
        result = self.db.execute(query)
        return [CancellationReasons(**row) for row in result.mappings()]

    def create_cancellation_reason(self, reason: str):
        query = text("CALL add_cancellation_reason(:reason)")
        self.db.execute(query, {"reason": reason})
        self.db.commit()

    def delete_cancellation_reason(self, cancellation_reason_id: int):
        query = text("CALL delete_cancellation_reason(:cancellation_reason_id)")
        self.db.execute(query, {"cancellation_reason_id": cancellation_reason_id})
        self.db.commit()
    
    def update_cancellation_reason(self, cancellation_reason_id: int, reason: str):
        query = text("CALL update_cancellation_reason(:cancellation_reason_id, :reason)")
        self.db.execute(query, {"cancellation_reason_id": cancellation_reason_id, "reason": reason})
        self.db.commit()