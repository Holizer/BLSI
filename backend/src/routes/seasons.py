from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from src.services.season_service import SeasonService
from src.schemas.season import (
    SeasonWithWeeks
)
seasons_route = APIRouter(prefix="/seasons")

@seasons_route.get("/", response_model=list[SeasonWithWeeks])
async def get_seasons_with_weeks(db: Session = Depends(get_db)):
    return SeasonService(db).get_seasons_with_weeks()