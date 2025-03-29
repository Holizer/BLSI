from pydantic import BaseModel

class PlayerTeamModel(BaseModel):
    player_id: int
    first_name: str
    last_name: str
    team_id: int
    team_name: str

class TeamCoachCaptainModel(BaseModel):
    team_id: int
    team_name: str
    captain_name: str
    coach_name: str