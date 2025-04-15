from pydantic import BaseModel, Field
from datetime import date
from typing import List, Optional

class WeekBase(BaseModel):
    week_id: Optional[int] = None
    week_number: Optional[int] = None
    week_start: Optional[date] = None
    week_end: Optional[date] = None

class SeasonWithWeeks(BaseModel):
    season_id: int
    season_name: str
    season_start: date
    season_end: date
    weeks: List[WeekBase] = Field(default_factory=list)
    
class TeamStatistic(BaseModel):
    rank: int
    team_id: int
    team_name: str
    wins: int
    losses: int
    draws: int
    total_points: int
    win_percentage: float
    season_id: int
    season_name: str
    week_id: int
    week_start_date: date
    week_end_date: date

class PlayerStatistic(BaseModel):
    player_id: int
    player_name: str
    total_points: int
    average_points: int
    total_games: int
    handicap: float
    week_id: int
    season_id: int
    season_name: str
    week_start_date: date
    week_end_date: date

class SeasonPlayerBestGame(BaseModel):
    player_id: int
    player_name: str
    max_scored_points: int
    match_id: int
    season_id: int
    season_name: str
    week_id: int
    week_start_date: date
    week_end_date: date

class SeasonPlaygroundViews(BaseModel):
    playground_id: int
    playground_name: str
    week_id: int
    week_start_date: date
    week_end_date: date
    total_views: Optional[int]