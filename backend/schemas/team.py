from pydantic import BaseModel
from typing import Optional

class TeamCreateUpdateSchema(BaseModel):
    team_name: str
    captain_id: Optional[int] = None
    coach_id: Optional[int] = None