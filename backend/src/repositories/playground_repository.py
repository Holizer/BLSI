from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.sql import text
from src.schemas.playground import PlaygroundTypeSchema
from src.schemas.playground import PlaygroundInfoWithTypeSchema

class PlaygroundRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_playgrounds_types(self):
        query = text("SELECT * FROM get_playgrounds_types()")  
        result = self.db.execute(query)
        return [PlaygroundTypeSchema(**row) for row in result.mappings()]

    def get_playgrounds_full_info(self):
        query = text("SELECT * FROM get_playgrounds_full_info()")  
        result = self.db.execute(query)
        return [PlaygroundInfoWithTypeSchema(**row) for row in result.mappings()]
    
    #DELETE
    # Полное удаление команды, без удаления тренера из таблицы
    # def delete_coach(self, coach_id: int):
    #     query = text("CALL delete_coach(:coach_id)")
    #     self.db.execute(query, {"coach_id": coach_id})
    #     self.db.commit()
    
    # #POST
    # # Создать команду без капитана и тренера
    # def create_coach(self, coach_data: CreateCoachTeamSchema):
    #     query = text("CALL create_coach(:first_name, :last_name, :team_id)")
    #     params = coach_data.model_dump()
    #     self.db.execute(query, params)
    #     self.db.commit()

    # #PUT
    # # Изменить название команды
    # def update_coach(self, coach_data: CoachTeamSchema):
    #     query = text("CALL update_coach_team(:coach_id, :first_name, :last_name, :team_id)")
    #     params = coach_data.model_dump()
    #     self.db.execute(query, params)
    #     self.db.commit()