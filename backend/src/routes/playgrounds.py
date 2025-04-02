from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from src.services.playground_service import PlaygroundService

playgrounds_router = APIRouter(prefix="/playgrounds")

@playgrounds_router.get("/get-playgrounds-types")
async def get_playgrounds_types(db: Session = Depends(get_db)):
    return PlaygroundService(db).get_playgrounds_types()

@playgrounds_router.get("/get-playgrounds-full-info")
async def get_playgrounds_full_info(db: Session = Depends(get_db)):
    return PlaygroundService(db).get_playgrounds_full_info()


# @playgrounds_router.get("/get-playgrounds-info-with-types")
    # return CoachService(db).get_coaches()

# @coaches_router.post("/create-playground-type")
# async def create_coach(coachData: CreateCoachTeamSchema, db: Session = Depends(get_db)):
#     try:
#         CoachService(db).create_coach(coachData)
#         return {"message": f"Тренер '{coachData.first_name}' успешно создан!"}
#     except ValueError as e:
#         raise HTTPException(
#             status_code=400,
#             detail=str(e)
#         )

# # Назначение тренера
# @coaches_router.put("/update-coach")
# async def update_coach(coachData: CoachTeamSchema, db: Session = Depends(get_db)):
#     CoachService(db).update_coach(coachData)
#     return {"message": f"Тренер {coachData.first_name} успешно обновлен!"}

# # Удаление тренера
# @coaches_router.delete("/delete-coach/{coach_id}")
# async def delete_coach(coach_id: int, db: Session = Depends(get_db)):
#     CoachService(db).delete_coach(coach_id)
#     return {"message": f"Тренер успешно удален"}