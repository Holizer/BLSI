from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.sql import text
from src.schemas.match import (
    ScheduledMatch,
    CanceledMatch,
    ForfeitedMatch,
    CompletedMatch,
    MatchStatusType
)

class MatchRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_match_status_types(self):
        query = text("SELECT * FROM get_match_status_types()")  
        result = self.db.execute(query)
        return [MatchStatusType(**row) for row in result.mappings()]

    def get_scheduled_matches(self):
        query = text("SELECT * FROM get_scheduled_matches()")  
        result = self.db.execute(query)
        return [ScheduledMatch(**row) for row in result.mappings()]

    def get_canceled_matches(self):
        query = text("SELECT * FROM get_canceled_matches()")  
        result = self.db.execute(query)
        return [CanceledMatch(**row) for row in result.mappings()]
    
    def get_forfeited_matches(self):
        query = text("SELECT * FROM get_forfeited_matches()")  
        result = self.db.execute(query)
        return [ForfeitedMatch(**row) for row in result.mappings()]

    def get_completed_matches(self):
        query = text("SELECT * FROM get_completed_matches()")  
        result = self.db.execute(query)
        return [CompletedMatch(**row) for row in result.mappings()] 