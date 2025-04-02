from sqlalchemy.orm import Session
from src.repositories.address_repository import AddressRepository
from src.schemas.views import PlayerAddressSchema
from src.schemas.city import CitySchema
from sqlalchemy.exc import SQLAlchemyError

class AddressService:
    def __init__(self, db: Session):
        self.repository = AddressRepository(db)

    def get_player_address(self) -> list[PlayerAddressSchema]:
        return self.repository.get_player_address()

    def update_player_address(self, address_data: PlayerAddressSchema):
        return self.repository.update_player_address(address_data)

    def delete_player_address(self, player_id: int):
        try:
            return self.repository.delete_player_address(player_id)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise ValueError(error_msg)
        

    #ГОРОДА
    def get_cities(self) -> list[CitySchema]:
        return self.repository.get_cities()

    def delete_city(self, city_id: int):
        try:
            return self.repository.delete_city(city_id)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise ValueError(error_msg)

    def create_city(self, city_name: str):
        try:
            return self.repository.create_city(city_name)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise ValueError(error_msg)

    def update_city_name(self, city_data: CitySchema):
        try:
            return self.repository.update_city_name(city_data.city_id, city_data.city_name)
        except SQLAlchemyError as e:
            error_msg = str(e.orig).split("CONTEXT:")[0].strip()
            raise ValueError(error_msg)