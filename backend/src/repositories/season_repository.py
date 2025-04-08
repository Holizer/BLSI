from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from src.schemas.season import (
    SeasonWithWeeks
)

class SeasonRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_seasons_with_weeks(self):
        query = text("SELECT * FROM get_seasons_with_weeks()")  
        result = self.db.execute(query)
        return [SeasonWithWeeks(**row) for row in result.mappings()]
