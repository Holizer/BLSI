from sqlalchemy.orm import Session
from src.schemas.views import PlayerAddressSchema
from sqlalchemy.sql import text
from src.schemas.city import CitySchema

class AddressRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_player_address(self):
        query = text("SELECT * FROM get_player_address()")  
        result = self.db.execute(query)
        return [PlayerAddressSchema(**row) for row in result.mappings()]
    
    def delete_player_address(self, player_id: int):
        query = text("CALL delete_player_address(:player_id)")
        self.db.execute(query, {"player_id": player_id})
        self.db.commit()

    def update_player_address(self, address_data: PlayerAddressSchema):
        query = text("CALL update_player_address(:player_id, :first_name, :last_name, :city_id, :street, :house_number, :postal_code)")
        params = address_data.model_dump()
        self.db.execute(query, params)
        self.db.commit()
        return {"message": f"Адрес игрока {address_data.first_name} успешно обновлен."}

    #ГОРОДА
    def get_cities(self):
        query = text("SELECT * FROM get_cities()")  
        result = self.db.execute(query)
        return [CitySchema(**row) for row in result.mappings()]
    
    def delete_city(self, city_id: int):
        query = text("CALL delete_city(:city_id)")
        self.db.execute(query, {"city_id": city_id})
        self.db.commit()
    
    def create_city(self, city_name: str):
        query = text("CALL create_city(:city_name)")
        self.db.execute(query, {"city_name": city_name})
        self.db.commit()


    def update_city_name(self, city_id: int, city_name: str):
        query = text("CALL update_city_name(:city_id, :city_name)")
        self.db.execute(query, {"city_id": city_id, "city_name": city_name})
        self.db.commit()