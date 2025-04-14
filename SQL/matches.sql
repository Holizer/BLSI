CREATE OR REPLACE VIEW match_status_view AS
SELECT 
    ms.match_status_id,
    mst.match_status_type_id,
    mst.match_status_type,
    cr.cancellation_reason_id,
    cr.reason AS cancellation_reason,
    ms.forfeiting_team_id
FROM 
    match_status ms
JOIN 
    match_status_type mst ON ms.match_status_type_id = mst.match_status_type_id
LEFT JOIN 
    cancellation_reason cr ON ms.cancellation_reason_id = cr.cancellation_reason_id;

SELECT * FROM match_status_view


-- Сначала удаляем старое представление, если оно существует
DROP VIEW IF EXISTS scheduled_matches;

-- Создаем новое представление с нужной структурой
CREATE OR REPLACE VIEW scheduled_matches AS
SELECT 
    m.match_id,
    s.season_id,
    s.season_name,
    w.week_id,
    w.start_date AS week_start,
    w.end_date AS week_end,
    t1.team_id AS team1_id,
    t1.team_name AS team1_name,
    t2.team_id AS team2_id,
    t2.team_name AS team2_name,
    mi.event_date,
    mi.event_time,
    pg.playground_id,
    pg.playground_name,
	ms.match_status_id,
    mst.match_status_type_id,
    mst.match_status_type AS status
FROM match m
JOIN match_info mi ON m.match_info_id = mi.match_info_id
JOIN match_status ms ON mi.match_status_id = ms.match_status_id
JOIN match_status_type mst ON ms.match_status_type_id = mst.match_status_type_id
JOIN team t1 ON mi.team1_id = t1.team_id
JOIN team t2 ON mi.team2_id = t2.team_id
JOIN week w ON m.week_id = w.week_id
JOIN season s ON w.season_id = s.season_id
JOIN playground pg ON m.playground_id = pg.playground_id
WHERE mst.match_status_type = 'Запланирован'
ORDER BY mi.event_date, mi.event_time;

SELECT * FROM get_scheduled_matches()

DROP FUNCTION get_scheduled_matches

CREATE OR REPLACE FUNCTION get_scheduled_matches()
RETURNS SETOF scheduled_matches
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM scheduled_matches
    ORDER BY event_date DESC, event_time DESC;
    
    RAISE NOTICE 'Получены все запланированные матчи';
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Ошибка при получении отмененных матчей: %', SQLERRM;
END;
$$;

SELECT * FROM get_scheduled_matches()

DROP VIEW canceled_matches

CREATE OR REPLACE VIEW canceled_matches AS
SELECT 
    m.match_id,
    s.season_id, 
    s.season_name,
    w.week_id,
    w.start_date AS week_start,
    w.end_date AS week_end,
    t1.team_id AS team1_id, 
    t1.team_name AS team1_name,
    t2.team_id AS team2_id, 
    t2.team_name AS team2_name,
    mi.event_date,
    mi.event_time,
    pg.playground_id,
    pg.playground_name,
    ms.match_status_id,
    mst.match_status_type_id,
    mst.match_status_type AS status,
    cr.cancellation_reason_id,
    cr.reason AS cancellation_reason
FROM match m
JOIN match_info mi ON m.match_info_id = mi.match_info_id
JOIN match_status ms ON mi.match_status_id = ms.match_status_id
JOIN match_status_type mst ON ms.match_status_type_id = mst.match_status_type_id
JOIN cancellation_reason cr ON ms.cancellation_reason_id = cr.cancellation_reason_id
JOIN team t1 ON mi.team1_id = t1.team_id
JOIN team t2 ON mi.team2_id = t2.team_id
JOIN week w ON m.week_id = w.week_id
JOIN season s ON w.season_id = s.season_id
JOIN playground pg ON m.playground_id = pg.playground_id
WHERE mst.match_status_type = 'Отменен'
ORDER BY mi.event_date DESC;

SELECT * FROM canceled_matches

CREATE OR REPLACE FUNCTION get_canceled_matches()
RETURNS SETOF canceled_matches
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM canceled_matches
    ORDER BY event_date DESC, event_time DESC;
    
    RAISE NOTICE 'Получены все отмененные матчи';
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Ошибка при получении отмененных матчей: %', SQLERRM;
END;
$$;

SELECT * FROM get_canceled_matches()

DROP VIEW forfeited_matches

CREATE OR REPLACE VIEW forfeited_matches AS
SELECT 
    m.match_id,
    s.season_id,
    s.season_name,
    w.week_id,
    w.start_date AS week_start,
    w.end_date AS week_end,
    t1.team_id AS team1_id,
    t1.team_name AS team1_name,
    t2.team_id AS team2_id,
    t2.team_name AS team2_name,
    mi.event_date,
    mi.event_time,
    pg.playground_id,
    pg.playground_name,
    ms.match_status_id,
    mst.match_status_type_id,
    mst.match_status_type AS status,
    ft.team_id AS forfeiting_team_id,
    ft.team_name AS forfeiting_team_name
FROM match m
JOIN match_info mi ON m.match_info_id = mi.match_info_id
JOIN match_status ms ON mi.match_status_id = ms.match_status_id
JOIN match_status_type mst ON ms.match_status_type_id = mst.match_status_type_id
JOIN team t1 ON mi.team1_id = t1.team_id
JOIN team t2 ON mi.team2_id = t2.team_id
JOIN team ft ON ms.forfeiting_team_id = ft.team_id
JOIN week w ON m.week_id = w.week_id
JOIN season s ON w.season_id = s.season_id
JOIN playground pg ON m.playground_id = pg.playground_id
WHERE mst.match_status_type = 'Неявка команды'
ORDER BY mi.event_date DESC;

SELECT * FROM forfeited_matches

CREATE OR REPLACE FUNCTION get_forfeited_matches()
RETURNS SETOF forfeited_matches
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM forfeited_matches
    ORDER BY event_date DESC, event_time DESC;
    
    RAISE NOTICE 'Получены все матчи с неявками';
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Ошибка при получении отмененных матчей: %', SQLERRM;
END;
$$;

SELECT * FROM get_forfeited_matches()

DROP VIEW completed_matches
CREATE OR REPLACE VIEW completed_matches AS
SELECT 
    m.match_id,
    s.season_id, 
    s.season_name,
    w.week_id,
    w.start_date AS week_start,
    w.end_date AS week_end,
    t1.team_id AS team1_id,
    t1.team_name AS team1_name,
    t2.team_id AS team2_id,
    t2.team_name AS team2_name,
    mi.team1_points,
    mi.team2_points,
    mi.event_date,
    mi.event_time,
    pg.playground_id,
    pg.playground_name,
    CASE 
        WHEN mi.team1_points > mi.team2_points THEN t1.team_name
        WHEN mi.team1_points < mi.team2_points THEN t2.team_name
        ELSE 'Ничья'
    END AS winner,
    mst.match_status_type AS status,
    mst.match_status_type_id,
    ms.match_status_id
FROM match m
JOIN match_info mi ON m.match_info_id = mi.match_info_id
JOIN match_status ms ON mi.match_status_id = ms.match_status_id
JOIN match_status_type mst ON ms.match_status_type_id = mst.match_status_type_id
JOIN team t1 ON mi.team1_id = t1.team_id
JOIN team t2 ON mi.team2_id = t2.team_id
JOIN week w ON m.week_id = w.week_id
JOIN season s ON w.season_id = s.season_id
JOIN playground pg ON m.playground_id = pg.playground_id
WHERE mst.match_status_type = 'Завершен'
ORDER BY mi.event_date DESC;

DROP FUNCTION get_completed_matches
SELECT * FROM get_completed_matches()

CREATE OR REPLACE FUNCTION get_completed_matches()
RETURNS SETOF completed_matches
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM completed_matches
    ORDER BY event_date DESC, event_time DESC;
    
    RAISE NOTICE 'Получены все завершенные матчи';
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Ошибка при получении отмененных матчей: %', SQLERRM;
END;
$$;


CREATE TABLE match_result_type (
    result_type_id SERIAL PRIMARY KEY,
    result_name VARCHAR(50) NOT NULL UNIQUE,
);

-- Заполняем стандартные значения
INSERT INTO match_result_type (result_name) VALUES
('Победа'),
('Поражение'),
('Ничья'),
('Победа (неявка соперника)'),
('Поражение (неявка)');

SELECT * FROM match_result_type

ALTER TABLE team_match_stats 
ALTER COLUMN match_result TYPE INT USING 1, -- Временное значение для изменения типа
ADD CONSTRAINT fk_match_result_type FOREIGN KEY (match_result) REFERENCES match_result_type(result_type_id);

-- Переименуем колонку для ясности
ALTER TABLE team_match_stats RENAME COLUMN match_result TO result_type_id;


DROP VIEW completed_matches

CREATE OR REPLACE VIEW completed_matches AS
SELECT 
    m.match_id,
    w.week_id,
    w.start_date AS week_start_date,
    w.end_date AS week_end_date,
    s.season_id,
    s.season_name,
    t1.team_name AS team1_name,
    t2.team_name AS team2_name,
    mi.team1_points,
    mi.team2_points,
    mi.event_date,
    mi.event_time,
    pg.playground_name,
    mst.match_status_type,
    cr.reason AS cancellation_reason,
    CASE 
        WHEN mi.team1_points > mi.team2_points THEN t1.team_name
        WHEN mi.team1_points < mi.team2_points THEN t2.team_name
        ELSE 'Ничья'
    END AS winner,
    mi.match_duration
FROM 
    match m
JOIN 
    match_info mi ON m.match_info_id = mi.match_info_id
JOIN 
    team t1 ON mi.team1_id = t1.team_id
JOIN 
    team t2 ON mi.team2_id = t2.team_id
JOIN 
    playground pg ON m.playground_id = pg.playground_id
JOIN 
    week w ON m.week_id = w.week_id
JOIN 
    season s ON w.season_id = s.season_id
JOIN 
    match_status ms ON mi.match_status_id = ms.match_status_id
JOIN 
    match_status_type mst ON ms.match_status_type_id = mst.match_status_type_id
LEFT JOIN 
    cancellation_reason cr ON ms.cancellation_reason_id = cr.cancellation_reason_id
WHERE 
    mst.match_status_type = 'Завершен' 

SELECT * FROM completed_matches	


CREATE OR REPLACE PROCEDURE create_match_player_stats(
    p_week_id INT,
    p_playground_id INT,
    p_match_info_id INT,
    p_season_id INT,
    p_player_stats JSON
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_player JSON;
    v_player_id INT;
    v_points INT;
    v_player_match_stats_id INT;
    v_player_stats_id INT;
BEGIN
    FOR v_player IN SELECT * FROM json_array_elements(p_player_stats)
    LOOP
        v_player_id := (v_player ->> 'player_id')::INT;
        v_points := (v_player ->> 'scored_points')::INT;

        -- Создаем запись в player_match_stats
        INSERT INTO player_match_stats (match_id, scored_points)
        VALUES (p_match_info_id, v_points)
        RETURNING player_match_stats_id INTO v_player_match_stats_id;

        -- Связываем игрока с его статистикой в матче
        INSERT INTO player_player_match_stats (player_match_stats_id, player_id)
        VALUES (v_player_match_stats_id, v_player_id);

        -- Ищем статистику за неделю и сезон
        SELECT player_stats_id INTO v_player_stats_id
        FROM player_player_stats
        WHERE player_id = v_player_id AND week_id = p_week_id AND season_id = p_season_id;

        -- Если нет статистики за неделю-сезон — создаем
        IF NOT FOUND THEN
            INSERT INTO player_stats (total_points, average_points, total_games, handicap)
            VALUES (0, 0, 0, 0)
            RETURNING player_stats_id INTO v_player_stats_id;

            INSERT INTO player_player_stats (player_stats_id, player_id, week_id, season_id)
            VALUES (v_player_stats_id, v_player_id, p_week_id, p_season_id);
        END IF;

        -- Обновляем общую статистику игрока
        UPDATE player_stats
        SET
            total_points = total_points + v_points,
            total_games = total_games + 1,
            average_points = (total_points + v_points) / (total_games + 1)
        WHERE player_stats_id = v_player_stats_id;

    END LOOP;
END;
$$;

SELECT * FROM get_player_team()
-- Создаем матч
CALL create_match(
    p_match_id => 0,                 -- OUT параметр
    p_match_info_id => 0,            -- OUT параметр
    p_match_status_id => 0,          -- OUT параметр
    p_status_type_id => 1,           -- Статус: завершен
    p_week_id => 41,                  -- ID недели
    p_playground_id => 6,            -- ID площадки
    p_team1_id => 41,                 -- ID команды 1
    p_team2_id => 42,                 -- ID команды 2
    p_event_date => '2025-04-15',    -- Дата события
    p_event_time => '15:00:00',      -- Время события
    p_cancellation_reason_id => NULL, -- Причина отмены (не используется для завершенного матча)
    p_forfeiting_team_id => NULL,    -- Неявка команды (не используется для завершенного матча)
    p_team1_points => 120,            -- Очки команды 1
    p_team2_points => 425,            -- Очки команды 2
    p_views_count => 1500,            -- Количество просмотров
    p_match_duration => '01:30',  -- Длительность матча
    p_player_stats => '[{"player_id": 1, "scored_points": 50}, {"player_id": 8, "scored_points": 82}, {"player_id": 14, "scored_points": 90}, {"player_id": 13, "scored_points": 40}]'
);


CALL create_match(
    p_match_id => 0,                 -- OUT параметр
    p_match_info_id => 0,            -- OUT параметр
    p_match_status_id => 0,          -- OUT параметр
    p_status_type_id => 1,           -- Статус: завершен
    p_week_id => 40,                  -- ID недели
    p_playground_id => 6,            -- ID площадки
    p_team1_id => 44,                 -- ID команды 1
    p_team2_id => 42,                 -- ID команды 2
    p_event_date => '2025-04-15',    -- Дата события
    p_event_time => '15:00:00',      -- Время события
    p_cancellation_reason_id => NULL, -- Причина отмены (не используется для завершенного матча)
    p_forfeiting_team_id => NULL,    -- Неявка команды (не используется для завершенного матча)
    p_team1_points => 120,            -- Очки команды 1
    p_team2_points => 425,            -- Очки команды 2
    p_views_count => 1500,            -- Количество просмотров
    p_match_duration => '01:30',  -- Длительность матча
    p_player_stats => NULL
);


CREATE OR REPLACE PROCEDURE create_match(
    OUT p_match_id INT,
    OUT p_match_info_id INT,
    OUT p_match_status_id INT,
    p_status_type_id INT,
    p_week_id INT,
    p_playground_id INT,
    p_team1_id INT,
    p_team2_id INT,
    p_event_date DATE,
    p_event_time TIME,
    p_cancellation_reason_id INT DEFAULT NULL,
    p_forfeiting_team_id INT DEFAULT NULL,
    p_team1_points INT DEFAULT NULL,
    p_team2_points INT DEFAULT NULL,
    p_views_count INT DEFAULT NULL,
    p_match_duration INTERVAL DEFAULT NULL,
    p_player_stats JSON DEFAULT NULL -- ⬅ добавлен JSON параметр
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_season_id INT;
BEGIN
  	v_season_id := get_season_id_from_week(p_week_id);
    -- Проверки сущностей и статуса
    IF NOT EXISTS (SELECT 1 FROM team WHERE team_id = p_team1_id) THEN
        RAISE EXCEPTION 'Команда с ID % не существует', p_team1_id;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM team WHERE team_id = p_team2_id) THEN
        RAISE EXCEPTION 'Команда с ID % не существует', p_team2_id;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM week WHERE week_id = p_week_id) THEN
        RAISE EXCEPTION 'Неделя с ID % не существует', p_week_id;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM playground WHERE playground_id = p_playground_id) THEN
        RAISE EXCEPTION 'Площадка с ID % не существует', p_playground_id;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM match_status_type WHERE match_status_type_id = p_status_type_id) THEN
        RAISE EXCEPTION 'Тип статуса с ID % не существует', p_status_type_id;
    END IF;

    -- Специфическая проверка по статусу
    IF p_status_type_id = 3 THEN
        IF p_cancellation_reason_id IS NULL THEN
            RAISE EXCEPTION 'Для отмененного матча должна быть указана причина';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM cancellation_reason WHERE cancellation_reason_id = p_cancellation_reason_id) THEN
            RAISE EXCEPTION 'Причина отмены с ID % не существует', p_cancellation_reason_id;
        END IF;

    ELSIF p_status_type_id = 4 THEN
        IF p_forfeiting_team_id IS NULL THEN
            RAISE EXCEPTION 'Для статуса "Неявка команды" должна быть указана команда';
        END IF;
        IF p_forfeiting_team_id NOT IN (p_team1_id, p_team2_id) THEN
            RAISE EXCEPTION 'Указанная команда не участвует в этом матче';
        END IF;

    ELSIF p_status_type_id = 2 THEN -- Завершен
        IF p_team1_points IS NULL OR p_team2_points IS NULL THEN
            RAISE EXCEPTION 'Для завершенного матча должны быть указаны очки обеих команд';
        END IF;
        IF p_player_stats IS NULL THEN
            RAISE EXCEPTION 'Для завершенного матча должна быть передана статистика игроков';
        END IF;
    END IF;

    -- Статус матча
    CALL create_match_status(
        p_match_status_id,
        p_status_type_id,
        p_cancellation_reason_id,
        p_forfeiting_team_id
    );

    -- Информация о матче
    INSERT INTO match_info (
        match_status_id, 
        team1_id, 
        team2_id, 
        team1_points, 
        team2_points, 
        views_count, 
        match_duration, 
        event_date, 
        event_time
    ) VALUES (
        p_match_status_id,
        p_team1_id,
        p_team2_id,
        p_team1_points,
        p_team2_points,
        p_views_count,
        p_match_duration,
        p_event_date,
        p_event_time
    ) RETURNING match_info_id INTO p_match_info_id;

    -- Сам матч
    INSERT INTO match (
        week_id, 
        playground_id, 
        match_info_id
    ) VALUES (
        p_week_id,
        p_playground_id,
        p_match_info_id
    ) RETURNING match_id INTO p_match_id;

    -- Если матч завершён — создаем статистику игроков
	IF p_status_type_id = 2 THEN
        -- Передаем уже существующий match_info_id и match_id для статистики
        CALL create_match_player_stats(
            p_week_id,
            p_playground_id,
            p_match_info_id,
            v_season_id,
            p_player_stats
        );
    END IF;

    RAISE NOTICE 'Успешно создан матч: ID=%, info_id=%, status_id=%', p_match_id, p_match_info_id, p_match_status_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Ошибка при создании матча: %', SQLERRM;
END;
$$;


SELECT * FROM match
SELECT * FROM match
SELECT * FROM match_info
SELECT * FROM match_status
SELECT * FROM match_status_type

SELECT * FROM team_match_stats
SELECT * FROM team_team_match_stats

SELECT * FROM team_team_stats
SELECT * FROM team_stats

SELECT * FROM team

CALL create_match(
    NULL, NULL, NULL,  -- OUT параметры (не указываем значения)
    1,                 -- p_status_type_id = 1 (Запланирован)
    40,                 -- p_week_id
    1,                 -- p_playground_id
    1,                 -- p_team1_id
    43,                 -- p_team2_id
    '2023-11-02',      -- p_event_date
    '13:00:00'         -- p_event_time
);

SELECT * FROM cancellation_reason

CALL create_match(
    NULL, NULL, NULL,  -- OUT параметры
    3,                 -- p_status_type_id = 3 (Отменен)
    40,                 -- p_week_id
    1,                 -- p_playground_id
    44,                 -- p_team1_id
    42,                 -- p_team2_id
    '2023-10-18',      -- p_event_date
    '18:00:00',        -- p_event_time
    4,                 -- p_cancellation_reason_id (например, 1 - Плохая погода)
);

CALL create_match(
    NULL, NULL, NULL,  -- OUT параметры (не указываем значения)
    4,                 -- p_status_type_id = 4 (Неявка команды)
    41,                -- p_week_id
    1,                 -- p_playground_id
    1,                 -- p_team1_id
    43,                -- p_team2_id
    '2023-11-02',      -- p_event_date
    '13:00:00',        -- p_event_time
    NULL,              -- p_cancellation_reason_id (not needed for forfeit)
    1                  -- p_forfeiting_team_id (either 1 or 43)
);

SELECT * FROM season
SELECT * FROM week

SELECT * FROM player_player_match_stats
SELECT * FROM player_match_stats
SELECT * FROM player_stats

DELETE FROM player_player_stats;
DELETE FROM player_stats;
DELETE FROM player_match_stats;
DELETE FROM player_player_match_stats;

DELETE FROM team_stats;
DELETE FROM team_team_stats;
DELETE FROM team_team_match_stats;
DELETE FROM team_match_stats;

DELETE FROM match_info; -- Если есть таблица событий матча
DELETE FROM match;      -- Основная таблица матчей
DELETE FROM match_status

TRUNCATE player_player_stats RESTART IDENTITY CASCADE;
TRUNCATE player_stats RESTART IDENTITY CASCADE;
TRUNCATE player_match_stats RESTART IDENTITY CASCADE;

TRUNCATE player_player_match_stats RESTART IDENTITY CASCADE;
TRUNCATE team_stats RESTART IDENTITY CASCADE;
TRUNCATE team RESTART IDENTITY CASCADE;
TRUNCATE team_team_stats RESTART IDENTITY CASCADE;
TRUNCATE team_team_match_stats RESTART IDENTITY CASCADE;
TRUNCATE team_match_stats RESTART IDENTITY CASCADE;
TRUNCATE match_info RESTART IDENTITY CASCADE;
TRUNCATE match_status RESTART IDENTITY CASCADE;


INSERT INTO season (season_name, start_date, end_date)
VALUES 
    ('Зимний кубок 2025', '2025-01-10', '2025-02-28'),
    ('Весенний чемпионат 2025', '2025-03-01', '2025-05-15'),
    ('Летняя лига 2025', '2025-05-20', '2025-08-15'),
    ('Осенний турнир 2025', '2025-08-20', '2025-10-31'),
    ('Финальный сезон 2025', '2025-11-05', '2025-12-20');

-- 2. Создаем 10 игровых недель (по 2 на каждый сезон)
INSERT INTO week (season_id, start_date, end_date)
VALUES 
    -- Зимний кубок 2025
    (6, '2025-01-13', '2025-01-19'),
    (6, '2025-02-10', '2025-02-16'),
    
    -- Весенний чемпионат 2025
    (7, '2025-03-03', '2025-03-09'),
    (7, '2025-04-07', '2025-04-13'),
    
    -- Летняя лига 2025
    (8, '2025-05-26', '2025-06-01'),
    (8, '2025-07-14', '2025-07-20'),
    
    -- Осенний турнир 2025
    (9, '2025-08-25', '2025-08-31'),
    (9, '2025-10-06', '2025-10-12'),
    
    -- Финальный сезон 2025
    (10, '2025-11-10', '2025-11-16'),
    (10, '2025-12-15', '2025-12-21');

