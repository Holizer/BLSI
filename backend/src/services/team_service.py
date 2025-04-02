from sqlalchemy.orm import Session
from src.repositories.team_repository import TeamRepository
from sqlalchemy.exc import SQLAlchemyError
from src.schemas.team import TeamSchema

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
    def create_team(self, team_name: str, captain_id: int = None, coach_id: int = None):
        try:
            return self.repository.create_team(team_name, captain_id, coach_id)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise ValueError(error_msg)

    #PUT
    def update_team_name(self, team_id: int, team_name: str):
        try:
            # Используются тригеры trg_check_team_name_unique
            return self.repository.update_team_name(team_id, team_name)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise ValueError(error_msg)
    
    #region Работа с капитанами
    def add_captain(self, team_id: int, player_id: int):
        return self.repository.add_captain(team_id, player_id)

    def remove_captain(self, team_id: int):
        return self.repository.remove_captain(team_id)

    def update_captain(self, team_id: int, new_captain_id: int):
        return self.repository.update_captain(team_id, new_captain_id)
    #endregion

    #region Работа с тренерами
    def add_coach(self, first_name: str, last_name: str):
        return self.repository.add_coach(first_name, last_name)

    def set_coach(self, team_id: int, coach_id: int):
        return self.repository.set_coach(team_id, coach_id)

    def remove_coach(self, team_id: int):
        return self.repository.remove_coach(team_id)
    #endregion