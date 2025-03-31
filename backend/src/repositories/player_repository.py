from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.sql import text
from src.schemas.views import PlayerTeamModel

class PlayerRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_player_team(self):
        query = text("SELECT * FROM get_player_team()")  
        result = self.db.execute(query)
        return [PlayerTeamModel(**row) for row in result.mappings()]
    
    def update_player_team(self, player_id, first_name, last_name, team_id):
        query = text("CALL update_player_team(:player_id, :first_name, :last_name, :team_id)")
        self.db.execute(query, { 'player_id': player_id, 'first_name': first_name, 'last_name': last_name, 'team_id': team_id})
        self.db.commit()
