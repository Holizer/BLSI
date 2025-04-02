from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.schemas.coach import CreateCoachTeamSchema
from src.schemas.coach import CoachTeamSchema
from database import get_db
from src.services.coach_service import CoachService

coaches_router = APIRouter(prefix="/coaches")

@coaches_router.get("/get-coaches")
async def get_coaches(db: Session = Depends(get_db)):
    return CoachService(db).get_coaches()

# Добавление тренера
@coaches_router.post("/create-coach")
async def create_coach(coachData: CreateCoachTeamSchema, db: Session = Depends(get_db)):
    try:
        CoachService(db).create_coach(coachData)
        return {"message": f"Тренер '{coachData.first_name}' успешно создан!"}
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

# Назначение тренера
@coaches_router.put("/update-coach")
async def update_coach(coachData: CoachTeamSchema, db: Session = Depends(get_db)):
    CoachService(db).update_coach(coachData)
    return {"message": f"Тренер {coachData.first_name} успешно обновлен!"}

# Удаление тренера
@coaches_router.delete("/delete-coach/{coach_id}")
async def delete_coach(coach_id: int, db: Session = Depends(get_db)):
    CoachService(db).delete_coach(coach_id)
    return {"message": f"Тренер успешно удален"}