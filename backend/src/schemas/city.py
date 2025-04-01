from pydantic import BaseModel, Field
from typing import Optional

class CityCreateSchema(BaseModel):
    city_name: str
    
class CitySchema(BaseModel):
    city_id: int
    city_name: str