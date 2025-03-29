from sqlalchemy.orm import Session
from repositories.player_repository import PlayerRepository

class PlayerService:
    def __init__(self, db: Session):
        self.repository = PlayerRepository(db)

    def get_player_team(self):
        return self.repository.get_player_team()
    
    # def get_captains(self):
    #     return self.repository.get_captains()
