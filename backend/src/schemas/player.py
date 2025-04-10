from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

class CreatePlayerSchema(BaseModel):
    first_name: str
    last_name: str
    age: int
    phone: str
    street: str
    house_number: int
    postal_code: int
    city_id: Optional[int] = None
    team_id: Optional[int] = None

class PlayerStatistics(BaseModel):
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

class PlayerStatisticsRequest(BaseModel):
    season_id: int
    week_ids: List[int]