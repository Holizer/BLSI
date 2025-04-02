from sqlalchemy.orm import Session
from src.repositories.coach_repository import CoachRepository
from sqlalchemy.exc import SQLAlchemyError
from src.schemas.coach import CoachTeamSchema
from src.schemas.coach import CreateCoachTeamSchema

class CoachService:
    def __init__(self, db: Session):
        self.repository = CoachRepository(db)

    def get_coaches(self) -> list[CoachTeamSchema]:
        return self.repository.get_coaches()
    
    def create_coach(self, coach_data: CreateCoachTeamSchema):
        try:
            return self.repository.create_coach(coach_data)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise ValueError(error_msg)
    
    def update_coach(self, coachData: CoachTeamSchema):
        try:
            return self.repository.update_coach(coachData)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise ValueError(error_msg)

    def delete_coach(self, coach_id: int):
        return self.repository.delete_coach(coach_id)