from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.services.team_service import TeamService
from src.schemas.team import TeamUpdateSchema
from database import get_db

team_router = APIRouter(prefix="/teams")

#region GET
@team_router.get("/teams-list")
async def get_team_list(db: Session = Depends(get_db)):
    return TeamService(db).get_teams()

@team_router.get("/teams-captain-coach")
async def get_teams_captain_coach(db: Session = Depends(get_db)):
    return TeamService(db).get_teams_captain_coach()
#endregion

#DELETE
@team_router.delete("/delete/{team_id}")
async def delete_team(team_id: int, db: Session = Depends(get_db)):
    TeamService(db).delete_team(team_id)
    return {"message": f"Команда успешно удалена!"}

#POST
@team_router.post("/create")
async def create_team(team_data: TeamUpdateSchema, db: Session = Depends(get_db)):
    try:
        TeamService(db).create_team(team_data.team_name, team_data.captain_id, team_data.coach_id)
        return {"message": f"Команда '{team_data.team_name}' успешно создана!"}
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

#PUT
@team_router.put("/update-team-name/{team_id}")
async def update_team_name(team_id: int, team_data: TeamUpdateSchema, db: Session = Depends(get_db)):
    try:
        TeamService(db).update_team_name(team_id, team_data.team_name)
        return {"message": f"Название команды успешно изменено!"}
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# Добавление капитана
@team_router.post("/add-captain")
async def add_captain(team_id: int, player_id: int, db: Session = Depends(get_db)):
    TeamService(db).add_captain(team_id, player_id)
    return {"message": f"Игрок {player_id} назначен капитаном команды {team_id}"}

# Удаление капитана
@team_router.delete("/remove-captain/{team_id}")
async def remove_captain(team_id: int, db: Session = Depends(get_db)):
    TeamService(db).remove_captain(team_id)
    return {"message": f"Капитан команды {team_id} удален"}

# Обновление капитана
@team_router.put("/update-captain/{team_id}")
async def update_captain(team_id: int, new_captain_id: int, db: Session = Depends(get_db)):
    TeamService(db).update_captain(team_id, new_captain_id)
    return {"message": f"Капитан команды {team_id} обновлен на игрока {new_captain_id}"}
