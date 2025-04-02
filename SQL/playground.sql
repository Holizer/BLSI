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


CREATE OR REPLACE VIEW playgrounds_with_types AS
SELECT 
    p.playground_id,
    p.playground_name,
    p.capacity,
    CASE 
        WHEN pt.playground_type IS NULL THEN 'Неизвестный тип'::VARCHAR(50)
        ELSE pt.playground_type
    END AS playground_type
FROM playground p
LEFT JOIN playground_type pt ON p.playground_type_id = pt.playground_type_id;

DROP FUNCTION get_playgrounds_info_with_types()
CREATE OR REPLACE FUNCTION get_playgrounds_full_info()
RETURNS SETOF playgrounds_with_types
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM playgrounds_with_types
    ORDER BY playground_id ASC;
    
    RAISE NOTICE 'Данные о площадках успешно получены';
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Ошибка при получении данных: %', SQLERRM;
END;
$$;

SELECT * FROM get_playgrounds_info_with_types()


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




