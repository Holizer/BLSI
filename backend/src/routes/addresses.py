from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.services.address_service import AddressService
from src.schemas.city import (
    CityCreateSchema,
    UpdateCitySchema,
    CitySchema
)
from src.schemas.views import PlayerAddressSchema
from database import get_db

addresses_router = APIRouter(prefix="/addresses")

@addresses_router.get("/get-player-address")
async def get_player_address(db: Session = Depends(get_db)):
    return AddressService(db).get_player_address()

@addresses_router.put("/update-player-address/{player_id}")
async def update_player_address(address_data: PlayerAddressSchema, db: Session = Depends(get_db)):
    try:
        AddressService(db).update_player_address(address_data)
        return {"message": f"Адерес успешно обновлен!"}
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@addresses_router.delete("/delete-player-address/{player_id}")
async def delete_city(player_id: int, db: Session = Depends(get_db)):
    return AddressService(db).delete_player_address(player_id)



#ГОРОДА
@addresses_router.get("/get-cities", response_model=list[CitySchema])
async def get_cities(db: Session = Depends(get_db)):
    return AddressService(db).get_cities()

@addresses_router.delete("/delete-city/{city_id}")
async def delete_city(city_id: int, db: Session = Depends(get_db)):
    return AddressService(db).delete_city(city_id)

@addresses_router.post("/create-city")
async def create_city(city_data: CityCreateSchema, db: Session = Depends(get_db)):
    try:
        AddressService(db).create_city(city_data.city_name)
        return {"message": f"Город '{city_data.city_name}' успешно создан!"}
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@addresses_router.put("/update-city-name/{city_id}")
async def update_city_name(city_id: int, city_data: UpdateCitySchema, db: Session = Depends(get_db)):
    try:
        AddressService(db).update_city_name(city_id, city_data)
        return {"message": f"Город '{city_data.city_name}' успешно обновлен!"}
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
