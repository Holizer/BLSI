from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from src.repositories.player_repository import PlayerRepository
from src.schemas.views import PlayerTeamSchema
from src.schemas.player import (
    CreatePlayerSchema,
    PlayerStatistics
)

class PlayerService:
    def __init__(self, db: Session):
        self.repository = PlayerRepository(db)


    def get_player_team(self) -> list[PlayerTeamSchema]:
        return self.repository.get_player_team()
    
    def get_player_statistics(self, season_id: int, week_ids: list[int]) -> list[PlayerStatistics]:
        return self.repository.get_player_statistics(season_id, week_ids)
    

    def update_player_team(self, player_data: PlayerTeamSchema):
        try:
            # Используются тригеры trg_check_phone_unique и trg_check_player_age
            return self.repository.update_player_team(player_data.model_dump())
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise ValueError(error_msg)
    

    def create_player(self, player_data: CreatePlayerSchema):
        try:
            # Используются тригеры trg_check_phone_unique и trg_check_player_age
            return self.repository.create_player(player_data)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise ValueError(error_msg)
        
    
    def delete_player(self, player_id: int):
        return self.repository.delete_player(player_id)