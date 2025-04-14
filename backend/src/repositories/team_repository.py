from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from src.schemas.team import (
    TeamSchema,
    TeamCoachCaptainModel
)

class TeamRepository:
    def __init__(self, db: Session):
        self.db = db

    # Получить список всех команд
    def get_teams(self):
        query = text("SELECT * FROM get_teams()")  
        result = self.db.execute(query)
        return [TeamSchema(**row) for row in result.mappings()]

    # Получить представление teams_coach_captain
    def get_teams_captain_coach(self):
        query = text("SELECT * FROM get_teams_coach_captain()")  
        result = self.db.execute(query)
        return [TeamCoachCaptainModel(**row) for row in result.mappings()]
    
    def delete_team(self, team_id: int):
        query = text("CALL delete_team(:team_id)")
        self.db.execute(query, {"team_id": team_id})
        self.db.commit()
    
    def create_team(self, team_name: str, player_id: int = None, coach_id: int = None):
        query = text("CALL create_team(:team_name, :captain_id, :coach_id)")
        self.db.execute(query, {"team_name": team_name, "captain_id": player_id, "coach_id": coach_id})
        self.db.commit()

    def update_team(self, team_id: int, team_name: str, captain_id: int = None, coach_id: int = None):
        query = text("CALL update_team(:team_id, :team_name, :captain_id, :coach_id)")
        self.db.execute(query, {"team_id": team_id, "team_name": team_name, "captain_id": captain_id, "coach_id": coach_id})
        self.db.commit()
        return {"message": f"Команда успешно обновлена"}