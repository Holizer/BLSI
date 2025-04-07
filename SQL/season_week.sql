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

CREATE OR REPLACE FUNCTION update_team_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Если матч завершен
    IF NEW.match_status_id = 2 THEN
        -- Обновляем статистику team1
        UPDATE team_stats
        SET 
            total_points = total_points + NEW.team1_points,
            wins = wins + CASE WHEN NEW.team1_points > NEW.team2_points THEN 1 ELSE 0 END,
            losses = losses + CASE WHEN NEW.team1_points < NEW.team2_points THEN 1 ELSE 0 END,
            draws = draws + CASE WHEN NEW.team1_points = NEW.team2_points THEN 1 ELSE 0 END
        WHERE team_id = NEW.team1_id;

        -- Обновляем статистику team2
        UPDATE team_stats
        SET 
            total_points = total_points + NEW.team2_points,
            wins = wins + CASE WHEN NEW.team2_points > NEW.team1_points THEN 1 ELSE 0 END,
            losses = losses + CASE WHEN NEW.team2_points < NEW.team1_points THEN 1 ELSE 0 END,
            draws = draws + CASE WHEN NEW.team2_points = NEW.team1_points THEN 1 ELSE 0 END
        WHERE team_id = NEW.team2_id;
    
    -- Если неявка команды
    ELSIF NEW.match_status_id = 5 THEN
        -- Команда, которая не явилась, получает 4 поражения
        UPDATE team_stats
        SET 
            losses = losses + 4
        WHERE team_id = (SELECT forfeiting_team_id FROM match_status WHERE match_status_id = NEW.match_status_id);
        
        -- Противник получает 4 победы
        UPDATE team_stats
        SET 
            wins = wins + 4
        WHERE team_id = CASE 
            WHEN NEW.team1_id = (SELECT forfeiting_team_id FROM match_status WHERE match_status_id = NEW.match_status_id) 
            THEN NEW.team2_id 
            ELSE NEW.team1_id 
        END;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


INSERT INTO match_info (
    match_status_id, 
    team1_id, 
    team2_id, 
    team1_points, 
    team2_points, 
    event_date, 
    event_time
)
VALUES (
    8,          -- Статус "Завершен"
    20,          -- team1_id
    36,          -- team2_id
    150,        -- Очки team1
    120,        -- Очки team2
    '2024-06-10',
    '18:00'
);

-- Привязываем к неделе и площадке
INSERT INTO match (week_id, playground_id, match_info_id)
VALUES (40, 1, 4);

SELECT * FROM match

SELECT * FROM playground;
SELECT * FROM week;
SELECT * FROM match_status_type;
SELECT * FROM match_status;
SELECT * FROM match_info;



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

SELECT * FROM scheduled_matches


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
