from pydantic import BaseModel, Field

class CityCreateSchema(BaseModel):
    city_name: str

class UpdateCitySchema(BaseModel):
    city_name: str
    
    
class CitySchema(BaseModel):
    city_id: int
    city_name: str