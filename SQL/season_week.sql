ALTER TABLE season
ADD COLUMN season_name VARCHAR(100);

CREATE OR REPLACE FUNCTION get_season_id_from_week(p_week_id INT)
RETURNS INT AS $$
DECLARE
    v_season_id INT;
BEGIN
    -- Предположим, что у нас есть таблица week, которая связана с сезоном
    SELECT season_id
    INTO v_season_id
    FROM week
    WHERE week_id = p_week_id;

    -- Если сезон не найден, выбрасываем исключение
    IF v_season_id IS NULL THEN
        RAISE EXCEPTION 'Сезон для недели с ID % не найден', p_week_id;
    END IF;

    RETURN v_season_id;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM get_season_id_from_week(44)

INSERT INTO season (season_name, start_date, end_date)
VALUES 
    ('Летний кубок 2024', '2024-06-01', '2024-08-31'),
    ('Осенний чемпионат 2024', '2024-09-01', '2024-11-30');

-- Шаг 3: Добавляем недели для Летнего кубка
INSERT INTO week (season_id, start_date, end_date)
VALUES 
    (4, '2024-06-03', '2024-06-09'),
    (4, '2024-06-10', '2024-06-16'),
    (4, '2024-06-17', '2024-06-23');

-- Шаг 4: Добавляем недели для Осеннего чемпионата
INSERT INTO week (season_id, start_date, end_date)
VALUES 
    (5, '2024-09-02', '2024-09-08'),
    (5, '2024-09-09', '2024-09-15');

SELECT * FROM season
SELECT * FROM week

	
CREATE OR REPLACE VIEW seasons_with_weeks AS
SELECT 
    s.season_id,
    s.season_name,
    s.start_date AS season_start,
    s.end_date AS season_end,
    w.week_id,
    w.start_date AS week_start,
    w.end_date AS week_end,
    ROW_NUMBER() OVER (PARTITION BY s.season_id ORDER BY w.start_date) AS week_number
FROM 
    season s
LEFT JOIN 
    week w ON s.season_id = w.season_id;

SELECT * FROM get_seasons_with_weeks()

CREATE OR REPLACE PROCEDURE update_season(
    p_season_id INT,
    p_season_name VARCHAR,
    p_start_date DATE,
    p_end_date DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM season WHERE season_id = p_season_id) THEN
        RAISE EXCEPTION 'Сезон с ID % не найден', p_season_id;
    END IF;

    UPDATE season
    SET season_name = p_season_name,
        start_date = p_start_date,
        end_date = p_end_date
    WHERE season_id = p_season_id;

    RAISE NOTICE 'Сезон успешно обновлен';
END;
$$;

ALTER TABLE week DROP CONSTRAINT IF EXISTS fk_season;
ALTER TABLE week DROP CONSTRAINT IF EXISTS fk_week_season;
ALTER TABLE week DROP CONSTRAINT IF EXISTS week_season_id_fkey;

-- Добавить один внешний ключ с каскадом
ALTER TABLE week
ADD CONSTRAINT fk_week_season
FOREIGN KEY (season_id) REFERENCES season(season_id) ON DELETE CASCADE;

CREATE OR REPLACE PROCEDURE delete_season(p_season_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM match m
        JOIN week w ON m.week_id = w.week_id
        WHERE w.season_id = p_season_id
    ) THEN
        RAISE EXCEPTION 'Нельзя удалить сезон, так как он содержит матчи';
    END IF;

    DELETE FROM season WHERE season_id = p_season_id;

    RAISE NOTICE 'Сезон успешно удален вместе с его неделями';
END;
$$;


CREATE OR REPLACE PROCEDURE create_season(
    p_season_name VARCHAR(100),
    p_start_date DATE,
    p_end_date DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_start_date > p_end_date THEN
        RAISE EXCEPTION 'Дата начала сезона (%) не может быть позже даты окончания (%)', p_start_date, p_end_date;
    END IF;
    
    INSERT INTO season (season_name, start_date, end_date)
    VALUES (p_season_name, p_start_date, p_end_date);
    
    RAISE NOTICE 'Сезон "%" успешно создан', p_season_name;
END;
$$;


CREATE OR REPLACE FUNCTION create_season_weeks()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_weeks_count INT;
    v_current_date DATE;
    v_week_start DATE;
    v_week_end DATE;
BEGIN
    -- Проверяем, что сезон длится хотя бы 1 день
    IF NEW.end_date - NEW.start_date < 0 THEN
        RAISE EXCEPTION 'Некорректные даты сезона';
    END IF;
    
    v_weeks_count := 0;
    v_current_date := NEW.start_date;
    
    WHILE v_current_date <= NEW.end_date LOOP
        v_week_start := v_current_date;
        
        -- Определяем конец недели (либо через 6 дней, либо в конце сезона)
        v_week_end := LEAST(v_week_start + INTERVAL '6 days', NEW.end_date)::DATE;
        
        -- Создаем неделю
        INSERT INTO week (season_id, start_date, end_date)
        VALUES (NEW.season_id, v_week_start, v_week_end);
        
        v_weeks_count := v_weeks_count + 1;
        v_current_date := v_week_end + 1;
    END LOOP;
    
    RAISE NOTICE 'Для сезона "%" (ID: %) создано % недель', NEW.season_name, NEW.season_id, v_weeks_count;
    
    RETURN NEW;
END;
$$;


CREATE TRIGGER after_season_insert
AFTER INSERT ON season
FOR EACH ROW
EXECUTE FUNCTION create_season_weeks();



DROP FUNCTION get_seasons_with_weeks

CREATE OR REPLACE FUNCTION get_seasons_with_weeks()
RETURNS TABLE (
    season_id INT,
    season_name VARCHAR,
    season_start DATE,
    season_end DATE,
    week_id INT,
    week_start DATE,
    week_end DATE,
    week_number INT
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.season_id,
        s.season_name,
        s.start_date,
        s.end_date,
        w.week_id,
        w.start_date,
        w.end_date,
        ROW_NUMBER() OVER (PARTITION BY s.season_id ORDER BY w.start_date)::INT
    FROM 
        season s
    LEFT JOIN 
        week w ON s.season_id = w.season_id
    ORDER BY 
        s.season_id ASC, 
        w.start_date ASC;
    
    RAISE NOTICE 'Данные успешно получены';
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Ошибка при получении данных: %', SQLERRM;
END;
$$;


SELECT * FROM week
SELECT * FROM season
SELECT * FROM team
SELECT * FROM player

INSERT INTO cancellation_reason (reason)
VALUES 
    ('Плохие погодные условия'),
    ('Отсутствие свободной площадки'),
    ('Технические проблемы'),
    ('Недостаточное количество игроков'),
    ('Медицинские причины'),
    ('Форс-мажорные обстоятельства'),
    ('Перенос по соглашению команд'),
    ('Нарушение регламента');

INSERT INTO match_status_type (match_status_type)
VALUES 
    ('Запланирован'),    -- 1
    ('Завершен'),        -- 2
    ('Отменен'),         -- 3
    ('Неявка команды');  -- 5


CREATE OR REPLACE FUNCTION get_match_status_types()
RETURNS SETOF match_status_type
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM match_status_type
    ORDER BY match_status_type_id ASC;
    
    RAISE NOTICE 'Тип матчей получены!';
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Ошибка при получении данных: %', SQLERRM;
END;
$$;

SELECT * FROM get_match_status_types()

SELECT * FROM match_status
INSERT INTO match_status (match_status_type_id, cancellation_reason_id, forfeiting_team_id)
VALUES
    (1, NULL, NULL),     -- Запланирован (без причины)
    (2, NULL, NULL),     -- Завершен (без причины)
    (3, 1, NULL),        -- Отменен из-за погоды
    (3, 8, NULL),        -- Отменен из-за нарушения регламента
    (4, 7, NULL),        -- Перенесен по соглашению
    (5, NULL, 20)        -- Неявка команды 1

SELECT * FROM match_status_type
SELECT * FROM match_info

-- Привязываем к неделе и площадке
INSERT INTO match (week_id, playground_id, match_info_id)
VALUES (40, 1, 4);

SELECT * FROM match
SELECT * FROM team
SELECT * FROM playground;
SELECT * FROM week;
SELECT * FROM match_status_type;
SELECT * FROM match_status;
SELECT * FROM match_status_view
SELECT * FROM playground

DELETE FROM team_team_match_stats
DELETE FROM team_match_stats
DELETE FROM match_info
DELETE FROM match

INSERT INTO match_info (
    match_status_id, team1_id, team2_id, 
    team1_points, team2_points, views_count, match_duration, event_date, event_time
) VALUES (
    2, 
    41, 
    36, 
    320, 240,
    2450, '01:15',
    '2024-08-10', '19:00'
);

INSERT INTO match (week_id, playground_id, match_info_id)
VALUES (41, 11, 23);

SELECT * FROM match;
SELECT * FROM match_info;
SELECT * FROM team_match_stats
SELECT * FROM team_team_match_stats
SELECT * FROM team_stats
SELECT * FROM team_team_stats


SELECT * FROM player_match_stats
SELECT * FROM player_player_match_stats
SELECT * FROM player_stats
