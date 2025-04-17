from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.sql import text
from src.schemas.playground import PlaygroundTypeSchema
from src.schemas.playground import PlaygroundSchema
from src.schemas.playground import CreatePlaygroundSchema

class PlaygroundRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_playgrounds_types(self):
        query = text("SELECT * FROM get_playgrounds_types()")  
        result = self.db.execute(query)
        return [PlaygroundTypeSchema(**row) for row in result.mappings()]

    def get_playgrounds_full_info(self):
        query = text("SELECT * FROM get_playgrounds_info()")  
        result = self.db.execute(query)
        return [PlaygroundSchema(**row) for row in result.mappings()]
    


    def delete_playeground(self, playground_id: int):
        query = text("CALL delete_playeground(:playground_id)")
        self.db.execute(query, {"playground_id": playground_id})
        self.db.commit()
    
    def delete_playeground_type(self, playeground_type_id: int):
        query = text("CALL delete_playeground_type(:playeground_type_id)")
        self.db.execute(query, {"playeground_type_id": playeground_type_id})
        self.db.commit()
    
    

    def create_playground(self, playground_data: CreatePlaygroundSchema):
        query = text("CALL create_playground(:playground_name, :capacity, :playground_type_id)")
        params = playground_data.model_dump()
        self.db.execute(query, params)
        self.db.commit()

    def create_playground_type(self, playground_type: str):
        query = text("CALL create_playground_type(:playground_type)")
        self.db.execute(query, {"playground_type": playground_type})
        self.db.commit()


    def update_playground_type(self, playground_type_id: int, playground_type: str):
        query = text("CALL update_playground_type(:playground_type_id, :playground_type)")
        self.db.execute(query, {"playground_type_id": playground_type_id, "playground_type": playground_type})
        self.db.commit()

    def update_playground(self, playground_id: int, playground_data: CreatePlaygroundSchema):
        query = text("CALL update_playground(:playground_id, :playground_name, :capacity, :playground_type_id)")
        params = {"playground_id": playground_id, **playground_data.model_dump()}
        self.db.execute(query, params)
        self.db.commit()
