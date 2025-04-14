from pydantic import BaseModel, conint
from typing import Optional, List
from datetime import date, time, timedelta

class MatchStatusType(BaseModel):
    match_status_type_id: int
    match_status_type: str

class ScheduledMatch(BaseModel):
    match_id: int
    season_id: int
    season_name: str
    week_id: int
    week_start: date
    week_end: date
    team1_id: int
    team1_name: str 
    team2_id: int
    team2_name: str
    event_date: date
    event_time: time
    playground_id: int
    playground_name: str
    match_status_id: int
    match_status_type_id: int
    status: str = "Запланирован"

class CanceledMatch(BaseModel):
    match_id: int
    season_id: int
    season_name: str
    week_id: int
    week_start: date
    week_end: date
    team1_id: int
    team1_name: str
    team2_id: int
    team2_name: str
    event_date: date
    event_time: time
    playground_id: int
    playground_name: str
    match_status_id: int
    match_status_type_id: int
    status: str = "Отменен"
    cancellation_reason_id: int
    cancellation_reason: str

class ForfeitedMatch(BaseModel):
    match_id: int
    season_id: int
    season_name: str
    week_id: int
    week_start: date
    week_end: date
    team1_id: int
    team1_name: str
    team2_id: int
    team2_name: str
    event_date: date
    event_time: time
    playground_id: int
    playground_name: str
    match_status_id: int
    match_status_type_id: int
    status: str = "Отменен"
    forfeiting_team_id: int
    forfeiting_team_name: str

class CompletedMatch(BaseModel):
    match_id: int
    season_id: int
    season_name: str
    week_id: int
    week_start: date
    week_end: date
    team1_id: int 
    team1_name: str
    team1_points: int
    team2_id: int 
    team2_name: str
    team2_points: int
    event_date: date
    event_time: time
    playground_id: int
    playground_name: str
    winner: str
    match_status_id: int
    match_status_type_id: int
    status: str = "Завершен"

class PlayerStat(BaseModel):
    player_id: int
    scored_points: conint(ge=0)

    class Config:
        from_attributes = True 

class MatchCreateSchema(BaseModel):
    status_type_id: int
    week_id: int
    playground_id: int
    team1_id: int
    team2_id: int
    event_date: date
    event_time: time
    cancellation_reason_id: Optional[int] = None
    forfeiting_team_id: Optional[int] = None
    team1_points: Optional[int] = None
    team2_points: Optional[int] = None
    views_count: Optional[int] = None
    match_duration: Optional[timedelta] = None
    player_stats: List[PlayerStat] = []