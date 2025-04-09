from datetime import date, time
from pydantic import BaseModel
from typing import Optional

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