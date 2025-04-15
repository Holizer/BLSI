from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from src.services.match_service import MatchService
from src.schemas.match import (
    ScheduledMatch,
    CanceledMatch,
    ForfeitedMatch,
    CompletedMatch,
    MatchCreateSchema,
    MatchStatusType
)
matches_route = APIRouter(prefix="/matches")

@matches_route.get("/status-types/", response_model=list[MatchStatusType])
async def get_match_status_types(db: Session = Depends(get_db)):
    return MatchService(db).get_match_status_types()

@matches_route.get("/scheduled/", response_model=list[ScheduledMatch])
async def get_scheduled_matches(
    season_id: int = Query(None),
    week_ids: list[int] = Query(None),
    db: Session = Depends(get_db)
):
    return MatchService(db).get_scheduled_matches(season_id, week_ids or [])

@matches_route.get("/canceled/", response_model=list[CanceledMatch])
async def get_canceled_matches(
    season_id: int = Query(None),
    week_ids: list[int] = Query(None),
    db: Session = Depends(get_db)
):
    return MatchService(db).get_canceled_matches(season_id, week_ids or [])

@matches_route.get("/forfeited/", response_model=list[ForfeitedMatch])
async def get_forfeited_matches(
    season_id: int = Query(None),
    week_ids: list[int] = Query(None),
    db: Session = Depends(get_db)
):
    return MatchService(db).get_forfeited_matches(season_id, week_ids or [])

@matches_route.get("/completed/", response_model=list[CompletedMatch])
async def get_completed_matches(
    season_id: int = Query(None),
    week_ids: list[int] = Query(None),
    db: Session = Depends(get_db)
):
    return MatchService(db).get_completed_matches(season_id, week_ids or [])

@matches_route.post("/")
async def create_match(match_data: MatchCreateSchema, db: Session = Depends(get_db)):
    try:
        MatchService(db).create_match(match_data)
        return {"message": f"Матч успешно создана!"}
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

