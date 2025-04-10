SELECT * FROM player_team_view
ORDER BY player_id ASC 

DROP
CREATE OR REPLACE VIEW player_team_view AS
SELECT 
    p.player_id,
    p.first_name,
    p.last_name,
	p.phone,
	p.age,
    t.team_id,
    COALESCE(t.team_name, 'Отстутсвует') AS team_name
FROM 
    player p
LEFT JOIN team t ON p.team_id = t.team_id;

-- Получение данных
--DROP FUNCTION get_player_team()
CREATE OR REPLACE FUNCTION get_player_team()
RETURNS SETOF player_team_view
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM player_team_view
    ORDER BY player_id ASC;
    
    RAISE NOTICE 'Данные игроков и команд успешно получены';
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Ошибка при получении данных: %', SQLERRM;
END;
$$;

SELECT * FROM get_teams();
SELECT * FROM get_player_address();

CALL create_player(
    'Пидоров', 
    'Сидоров', 
    '375422430523', 
    30, 
    'Советская', 
    7, 
    111222, 
    NULL,
    NULL
);


DROP  PROCEDURE create_player

CREATE OR REPLACE FUNCTION create_player(
    p_first_name VARCHAR(50),
    p_last_name VARCHAR(50),
    p_phone VARCHAR(20),
    p_age INT,
    p_street VARCHAR(150),
    p_house_number INT,
    p_postal_code INT,
    p_city_id INT DEFAULT NULL,
    p_team_id INT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_player_id INT;
    v_address_id INT;
BEGIN
    -- Проверка обязательных полей
    IF p_first_name IS NULL OR p_first_name = '' THEN
        RETURN json_build_object('status', 'error', 'message', 'Имя игрока обязательно для заполнения');
    END IF;
    
    IF p_last_name IS NULL OR p_last_name = '' THEN
        RETURN json_build_object('status', 'error', 'message', 'Фамилия игрока обязательна для заполнения');
    END IF;
    
    IF p_age < 18 OR p_age > 99 THEN
        RETURN json_build_object('status', 'error', 'message', 'Возраст игрока должен быть между 18 и 99 годами');
    END IF;
    
    IF p_street IS NULL OR p_street = '' THEN
        RETURN json_build_object('status', 'error', 'message', 'Улица обязательна для заполнения');
    END IF;
    
    IF p_house_number IS NULL OR p_house_number <= 0 THEN
        RETURN json_build_object('status', 'error', 'message', 'Номер дома должен быть положительным числом');
    END IF;
    
    IF p_postal_code IS NULL OR p_postal_code <= 0 THEN
        RETURN json_build_object('status', 'error', 'message', 'Почтовый индекс должен быть положительным числом');
    END IF;
    
    -- Проверка существования города, если указан
    IF p_city_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM city WHERE city_id = p_city_id) THEN
        RETURN json_build_object('status', 'error', 'message', 'Город с ID ' || p_city_id || ' не существует');
    END IF;
    
    -- Проверка существования команды, если указана
    IF p_team_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM team WHERE team_id = p_team_id) THEN
        RETURN json_build_object('status', 'error', 'message', 'Команда с ID ' || p_team_id || ' не существует');
    END IF;
    
    -- Создание адреса
    INSERT INTO address (
        city_id,
        street,
        house_number,
        postal_code
    ) VALUES (
        p_city_id,
        p_street,
        p_house_number,
        p_postal_code
    )
    RETURNING address_id INTO v_address_id;
    
    -- Создание игрока
    INSERT INTO player (
        first_name,
        last_name,
        phone,
        age,
        address_id,
        team_id
    ) VALUES (
        p_first_name,
        p_last_name,
        NULLIF(p_phone, ''),
        p_age,
        v_address_id,
        p_team_id
    )
    RETURNING player_id INTO v_player_id;
    
    -- Возвращаем успешный результат
    RETURN json_build_object(
        'status', 'success',
        'player_id', v_player_id,
        'address_id', v_address_id
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'status', 'error',
            'message', SQLERRM
        );
END;
$$;


CREATE OR REPLACE PROCEDURE delete_player(p_player_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
    v_captain_id INT;
BEGIN
    -- Проверяем, является ли игрок капитаном
    SELECT captain_id INTO v_captain_id FROM captain WHERE player_id = p_player_id;
    
    IF v_captain_id IS NOT NULL THEN
        -- Если игрок - капитан, сначала удаляем его из таблицы капитанов
        DELETE FROM captain WHERE captain_id = v_captain_id;
        
        -- Обновляем команду, убирая ссылку на капитана
        UPDATE team SET captain_id = NULL WHERE captain_id = v_captain_id;
    END IF;
    
    -- Удаляем связи игрока со статистикой по неделям
    DELETE FROM player_player_stats WHERE player_id = p_player_id;
    
    -- Удаляем связи игрока со статистикой по матчам
    DELETE FROM player_player_match_stats WHERE player_id = p_player_id;
    
    -- Удаляем самого игрока
    DELETE FROM player WHERE player_id = p_player_id;
    
    RAISE NOTICE 'Игрок с ID % успешно удален', p_player_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Ошибка при удалении игрока: %', SQLERRM;
END;
$$;


CREATE OR REPLACE PROCEDURE update_player_team(
    p_player_id INT,
    p_first_name VARCHAR(50),
    p_last_name VARCHAR(50),
    p_age INT,
    p_phone VARCHAR(20),
    p_team_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_age < 18 OR p_age > 99 THEN
        RAISE EXCEPTION 'Возраст должен быть от 18 до 99 лет';
    END IF;
    
    IF p_phone !~ '^[0-9\+][0-9\-]+$' THEN
        RAISE EXCEPTION 'Неверный формат номера телефона';
    END IF;

    UPDATE player
    SET 
        first_name = p_first_name,
        last_name = p_last_name,
        age = p_age,
        phone = p_phone,
        team_id = p_team_id
    WHERE player_id = p_player_id;

    RAISE NOTICE 'Игрок с ID % успешно обновлен', p_player_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Ошибка при обновлении игрока: %', SQLERRM;
END;
$$;

-- УНИКАЛЬНОСТЬ НОМЕРА
CREATE OR REPLACE FUNCTION is_phone_unique(
    p_phone VARCHAR(20),
    p_exclude_player_id INT DEFAULT NULL
) RETURNS BOOLEAN
AS $$
BEGIN
    RETURN NOT EXISTS(
        SELECT 1 FROM player 
        WHERE phone = p_phone 
        AND (p_exclude_player_id IS NULL OR player_id != p_exclude_player_id)
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_phone_uniqueness()
RETURNS TRIGGER
AS $$
BEGIN
    IF NEW.phone IS NOT NULL AND (TG_OP = 'INSERT' OR NEW.phone <> OLD.phone) THEN
        IF NOT is_phone_unique(
            NEW.phone, 
            CASE WHEN TG_OP = 'UPDATE' THEN NEW.player_id ELSE NULL END
        ) THEN
            RAISE EXCEPTION 'Номер телефона % уже используется другим игроком', NEW.phone;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ПРОВЕРКА ВОЗРАСТА
CREATE OR REPLACE FUNCTION check_player_age()
RETURNS TRIGGER
AS $$
BEGIN
    IF TG_OP = 'INSERT' OR NEW.age <> OLD.age THEN
        IF NEW.age < 18 OR NEW.age > 99 THEN
            RAISE EXCEPTION 'Возраст игрока должен быть от 18 до 99 лет. Указан возраст: %', NEW.age;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ТРИГЕРЫ
CREATE TRIGGER trg_check_phone_unique
BEFORE INSERT OR UPDATE OF phone ON player
FOR EACH ROW
EXECUTE FUNCTION check_phone_uniqueness();

CREATE TRIGGER trg_check_player_age
BEFORE INSERT OR UPDATE OF age ON player
FOR EACH ROW
EXECUTE FUNCTION check_player_age();


CALL check_phone_exists('3752912345683', NULL, 1);


CREATE VIEW captain_view AS
SELECT 
    c.captain_id AS captain_id,
    p.player_id AS player_id,
    p.first_name || ' ' || p.last_name AS full_name
FROM 
    captain c
JOIN 
    player p ON c.player_id = p.player_id;


CREATE VIEW player_statistics AS
SELECT 
    p.player_id,
    p.first_name || ' ' || p.last_name AS player_name,
    ps.total_points,
    ps.average_points,
    ps.total_games,
    ps.handicap,
    w.week_id,
    s.season_id,
    s.season_name,
    w.start_date AS week_start_date,
    w.end_date AS week_end_date
FROM 
    player p
JOIN 
    player_player_stats pps ON p.player_id = pps.player_id
JOIN 
    player_stats ps ON pps.player_stats_id = ps.player_stats_id
JOIN 
    week w ON pps.week_id = w.week_id
JOIN 
    season s ON w.season_id = s.season_id;

DROP FUNCTION get_player_statistics
DROP FUNCTION IF EXISTS get_player_statistics;

CREATE OR REPLACE FUNCTION get_player_statistics(
    p_season_id INT DEFAULT NULL,
    p_week_ids INT[] DEFAULT NULL
)
RETURNS TABLE (
    player_id INT,
    player_name TEXT,
    total_points INT,
    average_points INT,
    total_games INT,
    handicap FLOAT,
    week_id INT,
    season_id INT,
    season_name VARCHAR,
    week_start_date DATE,
    week_end_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.player_id,
        (p.first_name || ' ' || p.last_name)::TEXT AS player_name,
        ps.total_points,
        ps.average_points,
        ps.total_games,
        ps.handicap,
        w.week_id,
        s.season_id,
        s.season_name,
        w.start_date AS week_start_date,
        w.end_date AS week_end_date
    FROM 
        player p
    JOIN 
        player_player_stats pps ON p.player_id = pps.player_id
    JOIN 
        player_stats ps ON pps.player_stats_id = ps.player_stats_id
    JOIN 
        week w ON pps.week_id = w.week_id
    JOIN 
        season s ON w.season_id = s.season_id
    WHERE
        (p_season_id IS NULL OR s.season_id = p_season_id)
	AND (
	    p_week_ids IS NULL OR 
	    COALESCE(array_length(p_week_ids, 1), 0) = 0 OR 
	    w.week_id = ANY(p_week_ids) 
	)
    ORDER BY total_points DESC;
END;
$$ LANGUAGE plpgsql;



SELECT * 
FROM get_player_statistics(4);


SELECT * 
FROM get_player_statistics(4, ARRAY[40]);

	