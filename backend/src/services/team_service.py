from sqlalchemy.orm import Session
from src.repositories.team_repository import TeamRepository
from sqlalchemy.exc import SQLAlchemyError
from src.schemas.team import (
    TeamSchema,
    TeamUpdateSchema
)

class TeamService:
    def __init__(self, db: Session):
        self.repository = TeamRepository(db)

    #region GET
    def get_teams(self) -> list[TeamSchema]:
        return self.repository.get_teams()
    
    def get_teams_captain_coach(self):
        return self.repository.get_teams_captain_coach()
    #endregion
    
    #DELETE
    def delete_team(self, team_id: int):
        return self.repository.delete_team(team_id)
    
    #POST
    def create_team(self, team_name: str):
        try:
            return self.repository.create_team(team_name)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise ValueError(error_msg)

    #PUT
    def update_team(self, team_id: int, team_data: TeamUpdateSchema):
        try:
            # Используются тригеры trg_check_team_name_unique
            return self.repository.update_team(team_id, team_data.team_name, team_data.captain_id, team_data.coach_id)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise ValueError(error_msg)