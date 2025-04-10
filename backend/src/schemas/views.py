from pydantic import BaseModel, Field, conint, constr
from typing import Optional

class PlayerTeamSchema(BaseModel):
    player_id: int
    first_name: str
    last_name: str
    age: int
    phone: str 
    team_id: Optional[int] = None
    team_name: str


class PlayerAddressSchema(BaseModel):
    player_id: int
    first_name: str
    last_name: str
    city_id: Optional[int] = None
    city_name: Optional[str] = None
    street: str
    house_number: int
    postal_code: int