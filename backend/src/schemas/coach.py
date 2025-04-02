from pydantic import BaseModel, Field
from typing import Optional

class CreateCoachTeamSchema(BaseModel):
    first_name: str
    last_name: str
    team_id: Optional[int] = None

class CoachTeamSchema(BaseModel):
    coach_id: int
    first_name: str
    last_name: str
    team_id: Optional[int] = None
    team_name: str