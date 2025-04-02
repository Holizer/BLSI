from pydantic import BaseModel, Field
from typing import Optional

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