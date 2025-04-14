from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.sql import text
from src.schemas.match import (
    ScheduledMatch,
    CanceledMatch,
    ForfeitedMatch,
    CompletedMatch,
    MatchCreateSchema,
    PlayerStat,
    MatchStatusType
)
import json

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
    
    def create_match(self, match_data: MatchCreateSchema):
        query = text("""
            CALL create_match(
                :p_match_id,
                :p_match_info_id,
                :p_match_status_id,
                :p_status_type_id,
                :p_week_id,
                :p_playground_id,
                :p_team1_id,
                :p_team2_id,
                :p_event_date,
                :p_event_time,
                :p_cancellation_reason_id,
                :p_forfeiting_team_id,
                :p_team1_points,
                :p_team2_points,
                :p_views_count,
                :p_match_duration,
                :p_player_stats
            )
        """)
        
        player_stats = getattr(match_data, 'player_stats', [])
        serialized_stats = [PlayerStat.from_orm(stat).dict() for stat in player_stats]
    
        self.db.execute(query, {
            "p_match_id": 0,
            "p_match_info_id": 0,
            "p_match_status_id": 0,
            "p_status_type_id": match_data.status_type_id,
            "p_week_id": match_data.week_id,
            "p_playground_id": match_data.playground_id,
            "p_team1_id": match_data.team1_id,
            "p_team2_id": match_data.team2_id,
            "p_event_date": match_data.event_date,
            "p_event_time": match_data.event_time,
            "p_cancellation_reason_id": match_data.cancellation_reason_id,
            "p_forfeiting_team_id": match_data.forfeiting_team_id,
            "p_team1_points": match_data.team1_points,
            "p_team2_points": match_data.team2_points,
            "p_views_count": match_data.views_count,
            "p_match_duration": str(match_data.match_duration) if match_data.match_duration else None,
            "p_player_stats": json.dumps(serialized_stats)
        })
        self.db.commit()
