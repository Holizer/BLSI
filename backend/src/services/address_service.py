from sqlalchemy.orm import Session
from src.repositories.player_repository import PlayerRepository
from src.schemas.views import PlayerTeamSchema

class AddresService:
    def __init__(self, db: Session):
        self.repository = PlayerRepository(db)
