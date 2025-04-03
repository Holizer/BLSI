-- Заполняем типы игровых площадок
INSERT INTO playground_type (playground_type) VALUES
('Футбольное поле'),
('Баскетбольная площадка'),
('Волейбольная площадка'),
('Теннисный корт'),
('Хоккейная коробка'),
('Гандбольная площадка'),
('Регбийное поле'),
('Бейсбольное поле'),
('Сквош-корт'),
('Площадка для бадминтона');

-- Заполняем игровые площадки
INSERT INTO playground (playground_name, capacity) VALUES
('Стадион "Динамо"', 15000),
('Арена "Центральная"', 8000),
('Спорткомплекс "Олимпийский"', 12000),
('ФОК "Северный"', 500),
('СК "Юность"', 3000),
('Дворец спорта "Восток"', 7500),
('Стадион "Локомотив"', 10000),
('Спортцентр "Заря"', 2000),
('Арена "Спартак"', 9500),
('Спорткомплекс "Метеор"', 6000);


CREATE OR REPLACE VIEW playgrounds_view AS
SELECT 
    p.playground_id,
    p.playground_name,
    p.capacity,
	pt.playground_type_id,
    CASE 
        WHEN pt.playground_type IS NULL THEN 'Неизвестный тип'::VARCHAR(50)
        ELSE pt.playground_type
    END AS playground_type
FROM playground p
LEFT JOIN playground_type pt ON p.playground_type_id = pt.playground_type_id;

-- DROP FUNCTION get_playgrounds_info()
CREATE OR REPLACE FUNCTION get_playgrounds_info()
RETURNS SETOF playgrounds_view
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM playgrounds_view
    ORDER BY playground_id ASC;
    
    RAISE NOTICE 'Данные о площадках успешно получены';
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Ошибка при получении данных: %', SQLERRM;
END;
$$;

SELECT * FROM get_playgrounds_info()


CREATE OR REPLACE FUNCTION get_playgrounds_types()
RETURNS SETOF playground_type
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM playground_type
    ORDER BY playground_type_id ASC;
    
    RAISE NOTICE 'Данные о типах площадках успешно получены';
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Ошибка при получении данных: %', SQLERRM;
END;
$$;

SELECT * FROM get_playgrounds_types()

DROP TABLE IF EXISTS playground_playground_type;

-- Модифицируем таблицу площадок, добавляя прямой тип
ALTER TABLE playground ADD COLUMN playground_type_id INT;
ALTER TABLE playground ADD CONSTRAINT fk_playground_type 
    FOREIGN KEY (playground_type_id) REFERENCES playground_type(playground_type_id);

-- Обновляем существующие данные (пример для первой площадки)
UPDATE playground SET playground_type_id = 1 WHERE playground_id = 1;


-- Триггерная функция для проверки уникальности названия площадки
CREATE OR REPLACE FUNCTION check_playground_name_unique()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM playground WHERE playground_name = NEW.playground_name AND playground_id != COALESCE(NEW.playground_id, -1)) THEN
        RAISE EXCEPTION 'Название площадки "%" уже существует', NEW.playground_name;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггерная функция для проверки уникальности типа площадки
CREATE OR REPLACE FUNCTION check_playground_type_unique()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM playground_type WHERE playground_type = NEW.playground_type AND playground_type_id != COALESCE(NEW.playground_type_id, -1)) THEN
        RAISE EXCEPTION 'Тип площадки "%" уже существует', NEW.playground_type;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для проверки уникальности названия площадки
CREATE TRIGGER trg_playground_name_unique
BEFORE INSERT OR UPDATE ON playground
FOR EACH ROW EXECUTE FUNCTION check_playground_name_unique();

-- Триггер для проверки уникальности типа площадки
CREATE TRIGGER trg_playground_type_unique
BEFORE INSERT OR UPDATE ON playground_type
FOR EACH ROW EXECUTE FUNCTION check_playground_type_unique();

-- Процедура создания площадки
CREATE OR REPLACE PROCEDURE create_playground(
    p_playground_name VARCHAR(150),
    p_capacity INT,
    p_playground_type_id INT
)
AS $$
BEGIN
    INSERT INTO playground (playground_name, capacity, playground_type_id)
    VALUES (p_playground_name, p_capacity, p_playground_type_id);
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$ LANGUAGE plpgsql;

-- Процедура создания типа площадки
CREATE OR REPLACE PROCEDURE create_playground_type(
    p_playground_type VARCHAR(50)
)
AS $$
BEGIN
    INSERT INTO playground_type (playground_type)
    VALUES (p_playground_type);
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$ LANGUAGE plpgsql;

CALL create_playground_type('Новий тип')
-- Процедура обновления типа площадки
CREATE OR REPLACE PROCEDURE update_playground_type(
    p_playground_type_id INT,
    p_playground_type VARCHAR(50)
)
AS $$
BEGIN
    UPDATE playground_type
    SET playground_type = p_playground_type
    WHERE playground_type_id = p_playground_type_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Тип площадки с ID % не найден', p_playground_type_id;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$ LANGUAGE plpgsql;

-- Процедура удаления площадки
CREATE OR REPLACE PROCEDURE delete_playeground(
    p_playground_id INT
)
AS $$
BEGIN
    DELETE FROM playground WHERE playground_id = p_playground_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Площадка с ID % не найдена', p_playground_id;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$ LANGUAGE plpgsql;

-- Процедура удаления типа площадки
CREATE OR REPLACE PROCEDURE delete_playeground_type(
    p_playground_type_id INT
)
AS $$
BEGIN
    -- Проверяем, нет ли площадок с этим типом
    IF EXISTS (SELECT 1 FROM playground WHERE playground_type_id = p_playground_type_id) THEN
        RAISE EXCEPTION 'Нельзя удалить тип площадки, так как есть площадки, использующие этот тип';
    END IF;
    
    DELETE FROM playground_type WHERE playground_type_id = p_playground_type_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Тип площадки с ID % не найден', p_playground_type_id;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$ LANGUAGE plpgsql;

CALL delete_playeground_type(2)

-- Процедура обновления площадки (дополнение к вашему коду)
CREATE OR REPLACE PROCEDURE update_playground(
    p_playground_id INT,
    p_playground_name VARCHAR(150),
    p_capacity INT,
    p_playground_type_id INT
)
AS $$
BEGIN
    UPDATE playground
    SET 
        playground_name = p_playground_name,
        capacity = p_capacity,
        playground_type_id = p_playground_type_id
    WHERE playground_id = p_playground_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Площадка с ID % не найдена', p_playground_id;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$ LANGUAGE plpgsql;


