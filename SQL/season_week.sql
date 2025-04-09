ALTER TABLE season
ADD COLUMN season_name VARCHAR(100);

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

DROP VIEW 
CREATE OR REPLACE VIEW v_full_match_stats AS
SELECT 
    tms.team_match_stats_id,
    tms.match_id,
    t.team_id,
    t.team_name,
    tms.scored_points,
    rt.result_name AS result_type
FROM 
    team_match_stats tms
JOIN 
    team_team_match_stats ttms ON tms.team_match_stats_id = ttms.team_match_stats_id
JOIN 
    team t ON ttms.team_id = t.team_id
JOIN 
    match_result_type rt ON tms.result_type_id = rt.result_type_id;
	
SELECT * FROM v_full_match_stats
