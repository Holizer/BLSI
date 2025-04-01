from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from src.schemas.views import PlayerTeamSchema

class PlayerRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_player_team(self):
        query = text("SELECT * FROM get_player_team()")  
        result = self.db.execute(query)
        return [PlayerTeamSchema(**row) for row in result.mappings()]
    
    def update_player_team(self, player_data: dict) -> None:
        query = text("CALL update_player_team(:player_id, :first_name, :last_name, :age, :phone, :team_id)")
        self.db.execute(query, player_data)
        self.db.commit()

    def delete_player(self, player_id: int):
        query = text("CALL delete_player(:player_id)")
        self.db.execute(query, {"player_id": player_id})
        self.db.commit()
