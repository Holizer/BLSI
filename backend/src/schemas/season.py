from pydantic import BaseModel, Field
from datetime import date
from typing import List, Optional

class WeekBase(BaseModel):
    week_id: Optional[int] = None
    week_start: Optional[date] = None
    week_end: Optional[date] = None
    week_number: Optional[int] = None

    class Config:
        from_attributes = True

class SeasonWithWeeks(BaseModel):
    season_id: int
    season_name: str
    season_start: date
    season_end: date
    weeks: List[WeekBase] = Field(default_factory=list)

    class Config:
        from_attributes = True

    @classmethod
    def from_orm_with_weeks(cls, season_data: dict):
        """Хелпер для преобразования плоской структуры в иерархическую"""
        weeks = []
        if season_data.get('week_id') is not None:
            weeks.append(WeekBase(
                week_id=season_data['week_id'],
                week_start=season_data['week_start'],
                week_end=season_data['week_end'],
                week_number=season_data['week_number']
            ))
        
        return cls(
            season_id=season_data['season_id'],
            season_name=season_data['season_name'],
            season_start=season_data['season_start'],
            season_end=season_data['season_end'],
            weeks=weeks
        )