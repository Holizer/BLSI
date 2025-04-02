from sqlalchemy.orm import Session
from src.repositories.playground_repository import PlaygroundRepository
from sqlalchemy.exc import SQLAlchemyError
from src.schemas.playground import PlaygroundInfoWithTypeSchema
from src.schemas.playground import PlaygroundTypeSchema

class PlaygroundService:
    def __init__(self, db: Session):
        self.repository = PlaygroundRepository(db)

    def get_playgrounds_types(self) -> list[PlaygroundTypeSchema]:
        return self.repository.get_playgrounds_types()
    
    def get_playgrounds_full_info(self) -> list[PlaygroundInfoWithTypeSchema]:
        return self.repository.get_playgrounds_full_info()
    
    # def create_coach(self, coach_data: CreateCoachTeamSchema):
    #     try:
    #         return self.repository.create_coach(coach_data)
    #     except SQLAlchemyError as e:
    #         error_msg = str(e.orig).split("CONTEXT:")[0].strip()
    #         raise ValueError(error_msg)
    
    # def update_coach(self, coachData: CoachTeamSchema):
    #     try:
    #         return self.repository.update_coach(coachData)
    #     except SQLAlchemyError as e:
    #         error_msg = str(e.orig).split("CONTEXT:")[0].strip()
    #         raise ValueError(error_msg)

    # def delete_coach(self, coach_id: int):
    #     return self.repository.delete_coach(coach_id)