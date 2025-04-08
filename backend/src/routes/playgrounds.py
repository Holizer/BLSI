from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from src.services.playground_service import PlaygroundService
from src.schemas.playground import (
    PlaygroundTypeSchema,
    CreatePlaygroundType,
    UpdatePlaygroundType,
    PlaygroundSchema,
    CreatePlaygroundSchema,
    UpdatePlaygroundSchema,
)

playgrounds_router = APIRouter(prefix="/playgrounds")


@playgrounds_router.get("/", response_model=list[PlaygroundSchema])
async def get_playgrounds_full_info(db: Session = Depends(get_db)):
    return PlaygroundService(db).get_playgrounds_full_info()

@playgrounds_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_playground(
    playground_data: CreatePlaygroundSchema,
    db: Session = Depends(get_db)
):
    PlaygroundService(db).create_playground(playground_data)
    return {"message": "Площадка успешно создана"}

@playgrounds_router.put("/{playground_id}")
async def update_playground(
    playground_id: int,
    playground_data: UpdatePlaygroundSchema,
    db: Session = Depends(get_db)
):
    PlaygroundService(db).update_playground(playground_id, playground_data)
    return {"message": "Информация о площадке успешно обновлена"}

@playgrounds_router.delete("/{playground_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_playground(
    playground_id: int,
    db: Session = Depends(get_db)
):
    PlaygroundService(db).delete_playground(playground_id)



@playgrounds_router.get("/types", response_model=list[PlaygroundTypeSchema])
async def get_playgrounds_types(db: Session = Depends(get_db)):
    return PlaygroundService(db).get_playgrounds_types()

@playgrounds_router.post("/types", status_code=status.HTTP_201_CREATED)
async def create_playground_type(
    type_data: CreatePlaygroundType,
    db: Session = Depends(get_db)
):
    PlaygroundService(db).create_playground_type(type_data)
    return {"message": "Тип площадки успешно создан"}

@playgrounds_router.delete("/types/{type_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_playground_type(
    type_id: int,
    db: Session = Depends(get_db)
):
    PlaygroundService(db).delete_playground_type(type_id)

@playgrounds_router.put("/types/{type_id}")
async def update_playground_type(
    type_id: int,
    type_data: UpdatePlaygroundType,
    db: Session = Depends(get_db)
):
    PlaygroundService(db).update_playground_type(type_id, type_data)
    return {"message": "Тип площадки успешно обновлен"}