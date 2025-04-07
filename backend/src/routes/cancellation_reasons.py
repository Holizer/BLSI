from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from src.services.cancellation_reasons_service import СancellationReasonsService
from src.schemas.cancellation_reasons import (
    CreateCancellationReasons,
    UpdateCancellationReasons,
    CancellationReasons,
)

cancellation_reasons_router = APIRouter(prefix="/cancellation_reasons")

@cancellation_reasons_router.get("/", response_model=list[CancellationReasons])
async def get_cancellation_reasons(db: Session = Depends(get_db)):
    return СancellationReasonsService(db).get_cancellation_reasons()

@cancellation_reasons_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_cancellation_reason(
    cancellation_reason_data: CreateCancellationReasons,
    db: Session = Depends(get_db)
):
    СancellationReasonsService(db).create_cancellation_reason(cancellation_reason_data)
    return {"message": "Причина отмены матча создана!"}

@cancellation_reasons_router.put("/{cancellation_reason_id}")
async def update_cancellation_reason(
    cancellation_reason_id: int,
    cancellation_reason_data: UpdateCancellationReasons,
    db: Session = Depends(get_db)
):
    СancellationReasonsService(db).update_cancellation_reason(cancellation_reason_id, cancellation_reason_data.reason)
    return {"message": "Причина отмены матча успешно обновлена!"}

@cancellation_reasons_router.delete("/{cancellation_reason_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cancellation_reason(
    cancellation_reason_id: int,
    db: Session = Depends(get_db)
):
    СancellationReasonsService(db).delete_cancellation_reason(cancellation_reason_id)