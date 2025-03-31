from pydantic import BaseModel
from typing import Optional

class PlayerTeamModel(BaseModel):
    player_id: int
    first_name: str
    last_name: str
    team_id: Optional[int] = None 
    team_name: str = "Отсутствует" 

class TeamCoachCaptainModel(BaseModel):
    team_id: int
    team_name: str
    captain_name: str
    coach_name: str