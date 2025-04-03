from sqlalchemy.orm import Session
from src.repositories.playground_repository import PlaygroundRepository
from sqlalchemy.exc import SQLAlchemyError
from src.schemas.playground import (
    PlaygroundTypeSchema,
    CreatePlaygroundType,
    UpdatePlaygroundType,
    PlaygroundSchema,
    CreatePlaygroundSchema,
    UpdatePlaygroundSchema,
)
from fastapi import HTTPException

class PlaygroundService:
    def __init__(self, db: Session):
        self.repository = PlaygroundRepository(db)

    def get_playgrounds_types(self) -> list[PlaygroundTypeSchema]:
        try:
            return self.repository.get_playgrounds_types()
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise HTTPException(
                status_code=400,
                detail=f"Ошибка базы данных при получении типов площадок: {error_msg}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Неожиданная ошибка при получении типов площадок: {str(e)}"
            )
    
    def get_playgrounds_full_info(self) -> list[PlaygroundSchema]:
        try:
            return self.repository.get_playgrounds_full_info()
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise HTTPException(
                status_code=400,
                detail=f"Ошибка базы данных при получении информации о площадках: {error_msg}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Неожиданная ошибка при получении информации о площадках: {str(e)}"
            )

    def create_playground(self, playground_data: CreatePlaygroundSchema) -> None:
        try:
            self.repository.create_playground(playground_data)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise HTTPException(
                status_code=400,
                detail=f"Ошибка базы данных при создании площадки: {error_msg}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Неожиданная ошибка при создании площадки: {str(e)}"
            )

    def create_playground_type(self, playground_type: CreatePlaygroundType) -> None:
        try:
            self.repository.create_playground_type(playground_type.playground_type)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise HTTPException(
                status_code=400,
                detail=f"Ошибка базы данных при создании типа площадки: {error_msg}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Неожиданная ошибка при создании типа площадки: {str(e)}"
            )

    def update_playground(self, playground_id: int, playground_data: UpdatePlaygroundSchema) -> None:
        try:
            self.repository.update_playground(playground_id, playground_data)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise HTTPException(
                status_code=400,
                detail=f"Ошибка базы данных при обновлении площадки: {error_msg}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Неожиданная ошибка при обновлении площадки: {str(e)}"
            )

    def update_playground_type(self, type_id: int, type_data: UpdatePlaygroundType) -> None:
        try:
            self.repository.update_playground_type(type_id, type_data.playground_type)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise HTTPException(
                status_code=400,
                detail=f"Ошибка базы данных при обновлении типа площадки: {error_msg}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Неожиданная ошибка при обновлении типа площадки: {str(e)}"
            )

    def delete_playground(self, playground_id: int) -> None:
        try:
            self.repository.delete_playeground(playground_id)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise HTTPException(
                status_code=400,
                detail=f"Ошибка базы данных при удалении площадки: {error_msg}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Неожиданная ошибка при удалении площадки: {str(e)}"
            )

    def delete_playground_type(self, type_id: int) -> None:
        try:
            self.repository.delete_playeground_type(type_id)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise HTTPException(
                status_code=400,
                detail=f"Ошибка базы данных при удалении типа площадки: {error_msg}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Неожиданная ошибка при удалении типа площадки: {str(e)}"
            )