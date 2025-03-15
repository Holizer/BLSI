from dotenv import load_dotenv
import os
from sqlalchemy import create_engine, inspect
from sqlalchemy.exc import OperationalError

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

def check_db_connection():
    try:
        with engine.connect() as connection:
            print("Подключение к базе данных успешно!")

            inspector = inspect(engine)
            tables = inspector.get_table_names()
            print("Таблицы в базе данных:")
            for table in tables:
                print(table)

    except OperationalError as e:
        print(f"Ошибка подключения к базе данных: {e}")
