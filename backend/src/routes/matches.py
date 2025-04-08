from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from src.services.match_service import MatchService
from src.schemas.match import (
    ScheduledMatch,
    MatchStatusType
)
matches_route = APIRouter(prefix="/matches")

@matches_route.get("/scheduled/", response_model=list[ScheduledMatch])
async def get_cancellation_reasons(db: Session = Depends(get_db)):
    return MatchService(db).get_scheduled_matches()

@matches_route.get("/status-types/", response_model=list[MatchStatusType])
async def get_match_status_types(db: Session = Depends(get_db)):
    return MatchService(db).get_match_status_types()