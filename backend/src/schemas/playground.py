from pydantic import BaseModel, Field
from typing import Optional

# Типы площадок
class CreatePlaygroundType(BaseModel):
    playground_type: str = Field(..., min_length=2, max_length=50)

class UpdatePlaygroundType(BaseModel):
    playground_type: Optional[str] = Field(None, min_length=2, max_length=50)

class PlaygroundTypeSchema(BaseModel):
    playground_type_id: int
    playground_type: str

# Площадки
class CreatePlaygroundSchema(BaseModel):
    playground_name: str = Field(..., min_length=2, max_length=150)
    capacity: int = Field(..., gt=0)
    playground_type_id: int

class UpdatePlaygroundSchema(BaseModel):
    playground_name: Optional[str] = Field(None, min_length=2, max_length=150)
    capacity: Optional[int] = Field(None, gt=0)
    playground_type_id: Optional[int]

class PlaygroundSchema(BaseModel):
    playground_id: int
    playground_name: str
    capacity: int
    playground_type: str = Field(None, min_length=2, max_length=50)
    playground_type_id: Optional[int]