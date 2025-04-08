from datetime import date, time
from pydantic import BaseModel

class MatchStatusType(BaseModel):
    match_status_type_id: int
    match_status_type: str

class ScheduledMatch(BaseModel):
    match_id: int
    season_name: str
    week_start: date
    week_end: date
    team1: str
    team2: str
    event_date: date
    event_time: time
    playground_name: str
    status: str = "Запланирован"