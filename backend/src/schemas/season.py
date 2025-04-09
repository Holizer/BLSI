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
    
class TeamSeasonStats(BaseModel):
    team_id: int
    team_name: str
    season_id: int
    season_name: str
    wins: int
    losses: int
    draws: int
    total_points: int
    win_percentage: float
    season_rank: int