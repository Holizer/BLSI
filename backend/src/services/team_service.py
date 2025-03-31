from sqlalchemy.orm import Session
from src.repositories.team_repository import TeamRepository

class TeamService:
    def __init__(self, db: Session):
        self.repository = TeamRepository(db)

    #region GET
    def get_teams(self):
        return self.repository.get_teams()
    
    def get_teams_captain_coach(self):
        return self.repository.get_teams_captain_coach()
    #endregion
    
    #DELETE
    def delete_team(self, team_id: int):
        return self.repository.delete_team(team_id)
    
    #POST
    def create_team(self, team_name: str, captain_id: int = None, coach_id: int = None):
        existing_team = self.repository.check_team_name_exists(team_name)
        if existing_team:
            raise ValueError(f"Команда с названием '{team_name}' уже существует")
    
        return self.repository.create_team(team_name, captain_id, coach_id)

    #PUT
    def update_team_name(self, team_id: int, team_name: str):
        existing_team = self.repository.check_team_name_exists(team_name, team_id)
        if existing_team:
            raise ValueError(f"Команда с названием '{team_name}' уже существует")

        return self.repository.update_team_name(team_id, team_name)
    
    # def update_team(self, team_id: int, team_name: str, captain_id: int = None, coach_id: int = None):
    #     return self.repository.update_team(team_id, team_name, captain_id, coach_id)

    
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