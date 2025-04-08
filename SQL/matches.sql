CREATE OR REPLACE PROCEDURE create_match(
    p_week_id INT,
    p_playground_id INT,
    p_team1_id INT,
    p_team2_id INT,
    p_event_date DATE,
    p_event_time TIME
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_match_status_id INT;
    v_match_info_id INT;
    v_match_id INT;
BEGIN
    -- Создаем статус матча (по умолчанию "запланирован")
    INSERT INTO match_status (match_status_type_id, cancellation_reason_id, forfeiting_team_id)
    VALUES (1, NULL, NULL) -- 1 = 'запланирован'
    RETURNING match_status_id INTO v_match_status_id;
    
    -- Создаем информацию о матче
    INSERT INTO match_info (
        match_status_id, team1_id, team2_id, winning_team_id,
        team1_points, team2_points, views_count, match_duration,
        event_time, event_date
    ) VALUES (
        v_match_status_id, p_team1_id, p_team2_id, NULL,
        0, 0, 0, '00:00',
        p_event_time, p_event_date
    )
    RETURNING match_info_id INTO v_match_info_id;
    
    -- Создаем сам матч
    INSERT INTO match (week_id, playground_id, match_info_id)
    VALUES (p_week_id, p_playground_id, v_match_info_id)
    RETURNING match_id INTO v_match_id;
    
    -- Создаем статистику для команд
    INSERT INTO team_match_stats (match_id, scored_points, match_result)
    VALUES (v_match_id, 0, 'pending');
    
    INSERT INTO team_match_stats (match_id, scored_points, match_result)
    VALUES (v_match_id, 0, 'pending');
    
    -- Связываем статистику с командами
    INSERT INTO team_team_match_stats (team_match_stats_id, team_id)
    VALUES (currval('team_match_stats_team_match_stats_id_seq')-1, p_team1_id);
    
    INSERT INTO team_team_match_stats (team_match_stats_id, team_id)
    VALUES (currval('team_match_stats_team_match_stats_id_seq'), p_team2_id);
    
    COMMIT;
END;
$$;

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


CREATE OR REPLACE VIEW scheduled_matches AS
SELECT 
    m.match_id,
    s.season_name,
    w.start_date AS week_start,
    w.end_date AS week_end,
    t1.team_name AS team1,
    t2.team_name AS team2,
    mi.event_date,
    mi.event_time,
    pg.playground_name,
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

CREATE OR REPLACE FUNCTION get_scheduled_matches()
RETURNS SETOF scheduled_matches
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM scheduled_matches
    ORDER BY match_id DESC;
    
    RAISE NOTICE 'Данные о запланированных матчах получены!';
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Ошибка при получении данных: %', SQLERRM;
END;
$$;

SELECT * FROM get_scheduled_matches()


CREATE OR REPLACE VIEW completed_matches AS
SELECT 
    m.match_id,
    s.season_name,
    w.start_date AS week_start,
    w.end_date AS week_end,
    t1.team_name AS team1,
    t2.team_name AS team2,
    mi.team1_points,
    mi.team2_points,
    mi.event_date,
    pg.playground_name,
    CASE 
        WHEN mi.team1_points > mi.team2_points THEN t1.team_name
        WHEN mi.team1_points < mi.team2_points THEN t2.team_name
        ELSE 'Ничья'
    END AS winner,
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
WHERE mst.match_status_type = 'Завершен'
ORDER BY mi.event_date DESC;


SELECT * FROM completed_matches

CREATE OR REPLACE VIEW canceled_matches AS
SELECT 
    m.match_id,
    s.season_name,
    w.start_date AS week_start,
    w.end_date AS week_end,
    t1.team_name AS team1,
    t2.team_name AS team2,
    mi.event_date,
    cr.reason AS cancellation_reason,
    pg.playground_name,
    mst.match_status_type AS status
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

CREATE OR REPLACE VIEW forfeited_matches AS
SELECT 
    m.match_id,
    s.season_name,
    w.start_date AS week_start,
    w.end_date AS week_end,
    t1.team_name AS team1,
    t2.team_name AS team2,
    mi.event_date,
    forfeiter.team_name AS forfeiting_team,
    pg.playground_name,
    mst.match_status_type AS status
FROM match m
JOIN match_info mi ON m.match_info_id = mi.match_info_id
JOIN match_status ms ON mi.match_status_id = ms.match_status_id
JOIN match_status_type mst ON ms.match_status_type_id = mst.match_status_type_id
JOIN team t1 ON mi.team1_id = t1.team_id
JOIN team t2 ON mi.team2_id = t2.team_id
JOIN team forfeiter ON ms.forfeiting_team_id = forfeiter.team_id
JOIN week w ON m.week_id = w.week_id
JOIN season s ON w.season_id = s.season_id
JOIN playground pg ON m.playground_id = pg.playground_id
WHERE mst.match_status_type = 'Неявка команды'
ORDER BY mi.event_date DESC;


SELECT * FROM forfeited_matches


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


SELECT * FROM match
SELECT * FROM match_info
SELECT * FROM match_status


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