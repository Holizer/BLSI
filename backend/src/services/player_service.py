from sqlalchemy.orm import Session
from src.repositories.player_repository import PlayerRepository

class PlayerService:
    def __init__(self, db: Session):
        self.repository = PlayerRepository(db)

    def get_player_team(self):
        return self.repository.get_player_team()
    
    def update_player_team(self, player_id: int, first_name: str, last_name: str, team_id: int):
        return self.repository.update_player_team(player_id, first_name, last_name, team_id)
