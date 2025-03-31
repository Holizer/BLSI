from pydantic import BaseModel, Field
from typing import Optional

class TeamCreateUpdateSchema(BaseModel):
    team_name: str = Field(..., strip_whitespace=True, max_length=50, min_length=1, description="Название команды не может быть пустым или слишком длинным")
    captain_id: Optional[int] = None
    coach_id: Optional[int] = None
