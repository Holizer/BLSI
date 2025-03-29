from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.sql import text
from schemas.views import PlayerTeamModel

class PlayerRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_player_team(self):
        query = text("SELECT * FROM get_player_team()")  
        result = self.db.execute(query)
        return [PlayerTeamModel(**row) for row in result.mappings()]
    