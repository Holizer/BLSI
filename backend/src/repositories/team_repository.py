from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.sql import text
from src.schemas.views import TeamCoachCaptainModel
from src.models.models import Team

class TeamRepository:
    def __init__(self, db: Session):
        self.db = db

    #region GET
    # Получить список всех команд
    def get_teams(self):
        query = text("SELECT * FROM get_teams()")  
        result = self.db.execute(query)
        return [Team(**row) for row in result.mappings()]

    # Получить представление teams_coach_captain
    def get_teams_captain_coach(self):
        query = text("SELECT * FROM get_teams_coach_captain()")  
        result = self.db.execute(query)
        return [TeamCoachCaptainModel(**row) for row in result.mappings()]
    #endregion
    
    #DELETE
    # Полное удаление команды, без удаления тренера из таблицы
    def delete_team(self, team_id: int):
        query = text("CALL delete_team(:team_id)")
        self.db.execute(query, {"team_id": team_id})
        self.db.commit()
    
    #POST
    # Создать команду без капитана и тренера
    def create_team(self, team_name: str, captain_id: int = None, coach_id: int = None):
        query = text("CALL create_team(:team_name, :captain_id, :coach_id)")
        self.db.execute(query, {"team_name": team_name, "captain_id": captain_id, "coach_id": coach_id})
        self.db.commit()

    # Проверить существование команды
    def check_team_name_exists(self, team_name: str, exclude_id: int = None):
        query = text("SELECT * FROM check_team_name_exists(:team_name, :exclude_id)")
        result = self.db.execute(query, {"team_name": team_name, "exclude_id": exclude_id})
        self.db.commit()
        return result.scalar()

    #PUT
    # Изменить название команды
    def update_team_name(self, team_id: int, team_name: str, captain_id: int = None, coach_id: int = None):
        query = text("CALL update_team_name(:team_id, :team_name)")
        self.db.execute(query, {"team_id": team_id, "team_name": team_name})
        self.db.commit()
        return {"message": f"Название команды успешно изменено на '{team_name}'"}
 


    # def update_team(self, team_id: int, team_name: str, captain_id: int = None, coach_id: int = None):
    #     query = text("CALL update_team(:team_id, :team_name, :captain_id, :coach_id)")
    #     self.db.execute(query, {"team_id": team_id, "team_name": team_name, "captain_id": captain_id, "coach_id": coach_id})
    #     self.db.commit()


    
    # Действия с капитаном
    def add_captain(self, team_id: int, player_id: int):
        query = text("CALL add_captain(:team_id, :player_id)")
        self.db.execute(query, {"team_id": team_id, "player_id": player_id})
        self.db.commit()

    def remove_captain(self, team_id: int):
        query = text("CALL remove_captain(:team_id)")
        self.db.execute(query, {"team_id": team_id})
        self.db.commit()

    def update_captain(self, team_id: int, new_captain_id: int):
        query = text("CALL update_captain(:team_id, :new_captain_id)")
        self.db.execute(query, {"team_id": team_id, "new_captain_id": new_captain_id})
        self.db.commit()

    # Действия с тренером
    def add_coach(self, first_name: str, last_name: str):
        query = text("CALL add_coach(:first_name, :last_name)")
        self.db.execute(query, {"first_name": first_name, "last_name": last_name})
        self.db.commit()

    def set_coach(self, team_id: int, coach_id: int):
        query = text("CALL set_coach(:team_id, :coach_id)")
        self.db.execute(query, {"team_id": team_id, "coach_id": coach_id})
        self.db.commit()

    def remove_coach(self, team_id: int):
        query = text("CALL remove_coach(:team_id)")
        self.db.execute(query, {"team_id": team_id})
        self.db.commit()