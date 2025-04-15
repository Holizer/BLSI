from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from src.schemas.views import PlayerTeamSchema
from src.schemas.player import (
    CreatePlayerSchema,
)

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


    def create_player(self, player_data: CreatePlayerSchema):
        query = text("SELECT * FROM create_player(:first_name, :last_name, :phone, :age, :street, :house_number, :postal_code, :city_id, :team_id)")
        result = self.db.execute(query, player_data.model_dump()).fetchone()
        self.db.commit()
        
        result_data = result[0] 
        if result_data['status'] == 'error':
            raise ValueError(result_data['message'])
        
        return {
            'player_id': result_data['player_id'],
            'address_id': result_data['address_id']
        }


    def delete_player(self, player_id: int):
        query = text("CALL delete_player(:player_id)")
        self.db.execute(query, {"player_id": player_id})
        self.db.commit()
