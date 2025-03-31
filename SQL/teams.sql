CREATE OR REPLACE VIEW team_coach_captain_view AS
SELECT 
    t.team_id,
    t.team_name,
    CONCAT(c.first_name, ' ', c.last_name) AS captain_name,
    CONCAT(co.first_name, ' ', co.last_name) AS coach_name
FROM team t
LEFT JOIN captain ca ON t.captain_id = ca.captain_id
LEFT JOIN player c ON ca.player_id = c.player_id
LEFT JOIN coach co ON t.coach_id = co.coach_id;

SELECT * FROM get_teams()

CREATE OR REPLACE FUNCTION get_teams()
RETURNS TABLE (team_id INT, team_name VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT t.team_id, t.team_name
    FROM team t
    ORDER BY t.team_id ASC;
    
    RAISE NOTICE 'Данные команд успешно получены';
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Ошибка при получении данных: %', SQLERRM;
END;
$$;

SELECT * FROM get_teams_coach_captain()

CREATE OR REPLACE FUNCTION get_teams_coach_captain()
RETURNS SETOF team_coach_captain_view
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM team_coach_captain_view
    ORDER BY team_id ASC;
    
    RAISE NOTICE 'Данные команд успешно получены';
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Ошибка при получении данных: %', SQLERRM;
END;
$$;

CREATE OR REPLACE PROCEDURE create_team(
    p_team_name VARCHAR,
    p_captain_id INT,
    p_coach_id INT
) AS $$
BEGIN
    INSERT INTO team (team_name, captain_id, coach_id)
    VALUES (p_team_name, p_captain_id, p_coach_id);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE delete_team(p_team_id INT)
AS $$
DECLARE
    v_match_ids INT[];
BEGIN
    -- Собираем ID всех матчей, связанных с этой командой
    SELECT array_agg(m.match_id) INTO v_match_ids
    FROM match m
    JOIN match_info mi ON m.match_info_id = mi.match_info_id
    WHERE mi.team1_id = p_team_id OR mi.team2_id = p_team_id;

    -- Устанавливаем team_id = NULL для всех игроков этой команды
    UPDATE player 
    SET team_id = NULL 
    WHERE team_id = p_team_id;

    -- Удаляем статистику игроков в матчах этой команды
    DELETE FROM player_player_match_stats
    WHERE player_match_stats_id IN (
        SELECT pms.player_match_stats_id
        FROM player_match_stats pms
        WHERE pms.match_id = ANY(v_match_ids)
    );

    -- Удаляем статистику игроков, связанную с этой командой
    DELETE FROM player_player_stats
    WHERE player_id IN (SELECT player_id FROM player WHERE team_id = p_team_id);

    -- Удаляем статистику команды в матчах
    DELETE FROM team_team_match_stats
    WHERE team_match_stats_id IN (
        SELECT tms.team_match_stats_id
        FROM team_match_stats tms
        WHERE tms.match_id = ANY(v_match_ids)
    );

    -- Удаляем статистику команды
    DELETE FROM team_team_stats 
    WHERE team_id = p_team_id;

    -- Удаляем статистику матчей
    DELETE FROM player_match_stats
    WHERE match_id = ANY(v_match_ids);

    DELETE FROM team_match_stats
    WHERE match_id = ANY(v_match_ids);

    -- Удаляем сами матчи
    DELETE FROM match
    WHERE match_id = ANY(v_match_ids);

    -- Удаляем информацию о матчах
    DELETE FROM match_info
    WHERE team1_id = p_team_id OR team2_id = p_team_id;

    -- Удаляем саму команду из таблицы team
    DELETE FROM team 
    WHERE team_id = p_team_id;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM player


CREATE OR REPLACE FUNCTION check_team_name_exists(
    p_team_name VARCHAR,
    p_exclude_id INT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    IF p_exclude_id IS NULL THEN
        SELECT EXISTS(SELECT 1 FROM team WHERE team_name = p_team_name) INTO v_exists;
    ELSE
        SELECT EXISTS(SELECT 1 FROM team WHERE team_name = p_team_name AND team_id != p_exclude_id) INTO v_exists;
    END IF;
    
    RETURN v_exists;
END;
$$ LANGUAGE plpgsql;

SELECT check_team_name_exists('w', 123);

CREATE OR REPLACE FUNCTION update_team_name(
    p_team_id INT,
    p_new_name VARCHAR
) RETURNS VOID AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM teams WHERE team_name = p_new_name AND id != p_team_id) THEN
        RAISE EXCEPTION 'Команда с названием "%" уже существует', p_new_name;
    END IF;
    
    UPDATE teams SET team_name = p_new_name WHERE id = p_team_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Команда с ID % не найдена', p_team_id;
    END IF;
END;
$$ LANGUAGE plpgsql;
