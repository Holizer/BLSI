from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from src.services.match_service import MatchService
from src.schemas.match import (
    ScheduledMatch,
    CanceledMatch,
    ForfeitedMatch,
    MatchStatusType
)
matches_route = APIRouter(prefix="/matches")

@matches_route.get("/status-types/", response_model=list[MatchStatusType])
async def get_match_status_types(db: Session = Depends(get_db)):
    return MatchService(db).get_match_status_types()

@matches_route.get("/scheduled/", response_model=list[ScheduledMatch])
async def get_scheduled_matches(db: Session = Depends(get_db)):
    return MatchService(db).get_scheduled_matches()

@matches_route.get("/canceled/", response_model=list[CanceledMatch])
async def get_canceled_matches(db: Session = Depends(get_db)):
    return MatchService(db).get_canceled_matches()

@matches_route.get("/forfeited/", response_model=list[ForfeitedMatch])
async def get_forfeited_matches(db: Session = Depends(get_db)):
    return MatchService(db).get_forfeited_matches()
