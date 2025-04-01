from pydantic import BaseModel, Field, conint, constr
from typing import Optional


class UpdatePlayerTeamSchema(BaseModel):
    player_id: int
    first_name: str
    last_name: str
    age: int
    phone: str 
    team_id: int

class PlayerTeamSchema(BaseModel):
    player_id: int
    first_name: str
    last_name: str
    age: int
    phone: str 
    team_id: int
    team_name: str


class PlayerAddressSchema(BaseModel):
    player_id: int
    first_name: str
    last_name: str
    city_id: int
    city_name: str
    street: str
    house_number: int
    postal_code: int


class TeamCoachCaptainModel(BaseModel):
    team_id: int
    team_name: str
    captain_name: str
    coach_name: str