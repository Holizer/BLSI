from pydantic import BaseModel, Field, conint, constr
from typing import Optional

class PlayerTeamSchema(BaseModel):
    player_id: int
    first_name: str
    last_name: str
    age: int
    phone: str 
    team_id: Optional[int]
    team_name: str

class TeamCoachCaptainModel(BaseModel):
    team_id: int
    team_name: str
    captain_name: str
    coach_name: str