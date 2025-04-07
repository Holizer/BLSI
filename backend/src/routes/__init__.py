from fastapi import APIRouter
from .players import players_router
from .teams import team_router
from .addresses import addresses_router
from .coaches import coaches_router
from .playgrounds import playgrounds_router
from .cancellation_reasons import cancellation_reasons_router

api_router = APIRouter(prefix="/api")
api_router.include_router(players_router)
api_router.include_router(team_router)
api_router.include_router(addresses_router)
api_router.include_router(coaches_router)
api_router.include_router(playgrounds_router)
api_router.include_router(cancellation_reasons_router)