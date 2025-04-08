CREATE OR REPLACE FUNCTION update_player_handicap()
RETURNS TRIGGER AS $$
BEGIN
    -- Гандикап = 75% от (200 - средняя результативность), но не меньше 0
    NEW.handicap = GREATEST(0, FLOOR(0.75 * (200 - NEW.average_points)));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_player_handicap
BEFORE INSERT OR UPDATE ON player_stats
FOR EACH ROW
EXECUTE FUNCTION update_player_handicap();

CREATE OR REPLACE FUNCTION get_result_type_id(result_name_param VARCHAR(100))
RETURNS INT AS $$
DECLARE
    result_id INT;
BEGIN
    SELECT result_type_id INTO result_id
    FROM match_result_type
    WHERE result_name = result_name_param
    LIMIT 1;
    
    IF result_id IS NULL THEN
        RAISE EXCEPTION 'Тип результата "%" не найден', result_name_param;
    END IF;
    
    RETURN result_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_team_player_count(team_id_param INT)
RETURNS INT AS $$
DECLARE
    player_count INT;
BEGIN
    SELECT COUNT(*) INTO player_count
    FROM player
    WHERE team_id = team_id_param;
    
    RETURN player_count;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM get_team_player_count(1)

-- Удаляем старые триггеры
DROP TRIGGER IF EXISTS trigger_check_no_show ON match;
DROP TRIGGER IF EXISTS trigger_add_results ON match;

-- Создаем новую функцию для обработки неявок (AFTER INSERT)
CREATE OR REPLACE FUNCTION check_team_no_show()
RETURNS TRIGGER AS $$
DECLARE
    v_team1_id INT;
    v_team2_id INT;
    v_team1_players INT;
    v_team2_players INT;
    v_match_status_id INT;
    v_forfeit_team_id INT := NULL;
BEGIN
    -- Получаем ID команд
    SELECT team1_id, team2_id INTO v_team1_id, v_team2_id
    FROM match_info 
    WHERE match_info_id = NEW.match_info_id;
    
    -- Считаем игроков в командах
    v_team1_players := get_team_player_count(v_team1_id);
    v_team2_players := get_team_player_count(v_team2_id);

    -- Проверяем неявку (менее 2 игроков)
    IF v_team1_players < 2 OR v_team2_players < 2 THEN
        -- Определяем какая команда не явилась
        IF v_team1_players < 2 THEN
            v_forfeit_team_id := v_team1_id;
        ELSE
            v_forfeit_team_id := v_team2_id;
        END IF;
        
        -- Создаем запись о неявке
        INSERT INTO match_status (
            match_status_type_id, 
            cancellation_reason_id, 
            forfeiting_team_id
        ) VALUES (
            (SELECT match_status_type_id FROM match_status_type WHERE match_status_type = 'Отменен'),
            4, -- ID причины "Недостаточное кол-во игроков"
            v_forfeit_team_id
        ) RETURNING match_status_id INTO v_match_status_id;
        
        -- Обновляем статус матча
        UPDATE match_info 
        SET match_status_id = v_match_status_id
        WHERE match_info_id = NEW.match_info_id;
        
        -- Добавляем технические результаты
        PERFORM add_technical_results(NEW.match_id, v_team1_id, v_team2_id, v_forfeit_team_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Функция для обновления статистики команды
CREATE OR REPLACE FUNCTION update_team_stats(
    p_team_id INT,
    p_week_id INT,
    p_season_id INT,
    p_result_type VARCHAR,
    p_points INT
) RETURNS VOID AS $$
DECLARE
    v_stats_id INT;
    v_exists BOOLEAN;
BEGIN
    -- Проверяем, есть ли уже статистика для этой команды в этой неделе
    SELECT EXISTS (
        SELECT 1 FROM team_team_stats 
        WHERE team_id = p_team_id 
        AND week_id = p_week_id 
        AND season_id = p_season_id
    ) INTO v_exists;

    IF NOT v_exists THEN
        -- Создаем новую запись статистики
        INSERT INTO team_stats (wins, losses, draws, total_points)
        VALUES (0, 0, 0, 0)
        RETURNING team_stats_id INTO v_stats_id;
        
        -- Связываем команду со статистикой
        INSERT INTO team_team_stats (team_id, week_id, season_id, team_stats_id)
        VALUES (p_team_id, p_week_id, p_season_id, v_stats_id);
    ELSE
        -- Получаем существующий ID статистики
        SELECT team_stats_id INTO v_stats_id
        FROM team_team_stats
        WHERE team_id = p_team_id 
        AND week_id = p_week_id 
        AND season_id = p_season_id;
    END IF;

    -- Обновляем статистику в зависимости от результата
    IF p_result_type = 'Победа' OR p_result_type = 'Победа (неявка соперника)' THEN
        UPDATE team_stats 
        SET wins = wins + 1,
            total_points = total_points + p_points
        WHERE team_stats_id = v_stats_id;
    ELSIF p_result_type = 'Поражение' OR p_result_type = 'Поражение (неявка)' THEN
        UPDATE team_stats 
        SET losses = losses + 1,
            total_points = total_points + p_points
        WHERE team_stats_id = v_stats_id;
    ELSIF p_result_type = 'Ничья' THEN
        UPDATE team_stats 
        SET draws = draws + 1,
            total_points = total_points + p_points
        WHERE team_stats_id = v_stats_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Обновленная функция для добавления технических результатов
CREATE OR REPLACE FUNCTION add_technical_results(
    p_match_id INT,
    p_team1_id INT,
    p_team2_id INT,
    p_forfeit_team_id INT,
    p_week_id INT,
    p_season_id INT
) RETURNS VOID AS $$
DECLARE
    v_win_result_id INT;
    v_lose_result_id INT;
    v_stats_id INT;
BEGIN
    -- Получаем ID типов результатов для неявки
    v_win_result_id := get_result_type_id('Победа (неявка соперника)');
    v_lose_result_id := get_result_type_id('Поражение (неявка)');
    
    -- Обработка неявки
    IF p_forfeit_team_id = p_team1_id THEN
        -- Team1 не явилась (поражение)
        INSERT INTO team_match_stats (match_id, scored_points, result_type_id)
        VALUES (p_match_id, 0, v_lose_result_id)
        RETURNING team_match_stats_id INTO v_stats_id;
        
        INSERT INTO team_team_match_stats (team_match_stats_id, team_id)
        VALUES (v_stats_id, p_team1_id);
        
        -- Team2 победа (неявка соперника)
        INSERT INTO team_match_stats (match_id, scored_points, result_type_id)
        VALUES (p_match_id, 0, v_win_result_id)
        RETURNING team_match_stats_id INTO v_stats_id;
        
        INSERT INTO team_team_match_stats (team_match_stats_id, team_id)
        VALUES (v_stats_id, p_team2_id);
        
        -- Обновляем статистику команд
        PERFORM update_team_stats(p_team1_id, p_week_id, p_season_id, 'Поражение (неявка)', 0);
        PERFORM update_team_stats(p_team2_id, p_week_id, p_season_id, 'Победа (неявка соперника)', 0);
    ELSE
        -- Team2 не явилась (поражение)
        INSERT INTO team_match_stats (match_id, scored_points, result_type_id)
        VALUES (p_match_id, 0, v_lose_result_id)
        RETURNING team_match_stats_id INTO v_stats_id;
        
        INSERT INTO team_team_match_stats (team_match_stats_id, team_id)
        VALUES (v_stats_id, p_team2_id);
        
        -- Team1 победа (неявка соперника)
        INSERT INTO team_match_stats (match_id, scored_points, result_type_id)
        VALUES (p_match_id, 0, v_win_result_id)
        RETURNING team_match_stats_id INTO v_stats_id;
        
        INSERT INTO team_team_match_stats (team_match_stats_id, team_id)
        VALUES (v_stats_id, p_team1_id);
        
        -- Обновляем статистику команд
        PERFORM update_team_stats(p_team2_id, p_week_id, p_season_id, 'Поражение (неявка)', 0);
        PERFORM update_team_stats(p_team1_id, p_week_id, p_season_id, 'Победа (неявка соперника)', 0);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Обновленная функция для добавления результатов обычного матча
CREATE OR REPLACE FUNCTION add_match_results()
RETURNS TRIGGER AS $$
DECLARE
    v_team1_id INT;
    v_team2_id INT;
    v_team1_points INT;
    v_team2_points INT;
    v_win_result_id INT;
    v_lose_result_id INT;
    v_draw_result_id INT;
    v_stats_id INT;
    v_match_status_type VARCHAR;
    v_forfeit_team_id INT;
    v_week_id INT;
    v_season_id INT;
BEGIN
    -- Получаем ID недели и сезона
    SELECT week_id INTO v_week_id FROM match WHERE match_id = NEW.match_id;
    SELECT season_id INTO v_season_id FROM week WHERE week_id = v_week_id;
    
    -- Проверяем статус матча
    SELECT 
        mst.match_status_type,
        ms.forfeiting_team_id
    INTO 
        v_match_status_type,
        v_forfeit_team_id
    FROM match_info mi
    JOIN match_status ms ON mi.match_status_id = ms.match_status_id
    JOIN match_status_type mst ON ms.match_status_type_id = mst.match_status_type_id
    WHERE mi.match_info_id = NEW.match_info_id;
    
    -- Пропускаем если матч отменен (неявка уже обработана)
    IF v_match_status_type = 'Отменен' THEN
        RETURN NEW;
    END IF;
    
    -- Получаем данные о матче
    SELECT team1_id, team2_id, team1_points, team2_points
    INTO v_team1_id, v_team2_id, v_team1_points, v_team2_points
    FROM match_info 
    WHERE match_info_id = NEW.match_info_id;
    
    -- Получаем ID типов результатов
    v_win_result_id := get_result_type_id('Победа');
    v_lose_result_id := get_result_type_id('Поражение');
    v_draw_result_id := get_result_type_id('Ничья');
    
    -- Обработка обычного матча
    IF v_team1_points > v_team2_points THEN
        -- Team1 побеждает
        INSERT INTO team_match_stats (match_id, scored_points, result_type_id)
        VALUES (NEW.match_id, v_team1_points, v_win_result_id)
        RETURNING team_match_stats_id INTO v_stats_id;
        
        INSERT INTO team_team_match_stats (team_match_stats_id, team_id)
        VALUES (v_stats_id, v_team1_id);
        
        -- Team2 проигрывает
        INSERT INTO team_match_stats (match_id, scored_points, result_type_id)
        VALUES (NEW.match_id, v_team2_points, v_lose_result_id)
        RETURNING team_match_stats_id INTO v_stats_id;
        
        INSERT INTO team_team_match_stats (team_match_stats_id, team_id)
        VALUES (v_stats_id, v_team2_id);
        
        -- Обновляем статистику
        PERFORM update_team_stats(v_team1_id, v_week_id, v_season_id, 'Победа', v_team1_points);
        PERFORM update_team_stats(v_team2_id, v_week_id, v_season_id, 'Поражение', v_team2_points);
        
    ELSIF v_team1_points < v_team2_points THEN
        -- Team2 побеждает
        INSERT INTO team_match_stats (match_id, scored_points, result_type_id)
        VALUES (NEW.match_id, v_team2_points, v_win_result_id)
        RETURNING team_match_stats_id INTO v_stats_id;
        
        INSERT INTO team_team_match_stats (team_match_stats_id, team_id)
        VALUES (v_stats_id, v_team2_id);
        
        -- Team1 проигрывает
        INSERT INTO team_match_stats (match_id, scored_points, result_type_id)
        VALUES (NEW.match_id, v_team1_points, v_lose_result_id)
        RETURNING team_match_stats_id INTO v_stats_id;
        
        INSERT INTO team_team_match_stats (team_match_stats_id, team_id)
        VALUES (v_stats_id, v_team1_id);
        
        -- Обновляем статистику
        PERFORM update_team_stats(v_team2_id, v_week_id, v_season_id, 'Победа', v_team2_points);
        PERFORM update_team_stats(v_team1_id, v_week_id, v_season_id, 'Поражение', v_team1_points);
    ELSE
        -- Ничья (обе команды получают по 1 победе и 1 поражению)
        -- Team1 победа
        INSERT INTO team_match_stats (match_id, scored_points, result_type_id)
        VALUES (NEW.match_id, v_team1_points, v_win_result_id)
        RETURNING team_match_stats_id INTO v_stats_id;
        
        INSERT INTO team_team_match_stats (team_match_stats_id, team_id)
        VALUES (v_stats_id, v_team1_id);
        
        -- Team1 поражение
        INSERT INTO team_match_stats (match_id, scored_points, result_type_id)
        VALUES (NEW.match_id, v_team1_points, v_lose_result_id)
        RETURNING team_match_stats_id INTO v_stats_id;
        
        INSERT INTO team_team_match_stats (team_match_stats_id, team_id)
        VALUES (v_stats_id, v_team1_id);
        
        -- Team2 победа
        INSERT INTO team_match_stats (match_id, scored_points, result_type_id)
        VALUES (NEW.match_id, v_team2_points, v_win_result_id)
        RETURNING team_match_stats_id INTO v_stats_id;
        
        INSERT INTO team_team_match_stats (team_match_stats_id, team_id)
        VALUES (v_stats_id, v_team2_id);
        
        -- Team2 поражение
        INSERT INTO team_match_stats (match_id, scored_points, result_type_id)
        VALUES (NEW.match_id, v_team2_points, v_lose_result_id)
        RETURNING team_match_stats_id INTO v_stats_id;
        
        INSERT INTO team_team_match_stats (team_match_stats_id, team_id)
        VALUES (v_stats_id, v_team2_id);
        
        -- Обновляем статистику
        PERFORM update_team_stats(v_team1_id, v_week_id, v_season_id, 'Ничья', v_team1_points);
        PERFORM update_team_stats(v_team2_id, v_week_id, v_season_id, 'Ничья', v_team2_points);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создаем триггеры
CREATE TRIGGER trigger_check_no_show
AFTER INSERT ON match
FOR EACH ROW
EXECUTE FUNCTION check_team_no_show();

CREATE TRIGGER trigger_add_results
AFTER INSERT ON match
FOR EACH ROW
EXECUTE FUNCTION add_match_results();