from pydantic import BaseModel, Field
from typing import Optional

class PlaygroundTypeSchema(BaseModel):
    playground_type_id: int
    playground_type: str

class PlaygroundInfoWithTypeSchema(BaseModel):
    playground_id: int
    playground_name: str
    capacity: int
    playground_type: str
