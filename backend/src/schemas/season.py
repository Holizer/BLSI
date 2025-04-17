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
    

class UpdateSeason(BaseModel):
    season_name: str
    season_start: date
    season_end: date


class CreateSeason(BaseModel):
    season_name: str
    season_start: date
    season_end: date
