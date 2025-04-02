CREATE OR REPLACE VIEW coach_team_view AS
SELECT 
    c.coach_id,
    c.first_name,
    c.last_name,
    t.team_id,
      CASE 
        WHEN t.team_id IS NULL THEN 'Отсутствует'::VARCHAR(100)
        ELSE t.team_name
    END AS team_name
FROM 
    coach c
LEFT JOIN 
    team t ON c.coach_id = t.coach_id;


CREATE OR REPLACE FUNCTION get_teams_coach()
RETURNS SETOF coach_team_view
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM coach_team_view
    ORDER BY coach_id ASC;
    
    RAISE NOTICE 'Данные тренеров успешно получены';
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Ошибка при получении данных: %', SQLERRM;
END;
$$;

SELECT * FROM get_teams_coach()

-- DROP PROCEDURE create_coach
CREATE OR REPLACE PROCEDURE create_coach(
    p_first_name VARCHAR(50),
    p_last_name VARCHAR(50),
    p_team_id INT DEFAULT NULL
)
AS $$
DECLARE
    v_coach_id INT;
BEGIN
    -- Вставляем нового тренера
    INSERT INTO coach (first_name, last_name)
    VALUES (p_first_name, p_last_name)
    RETURNING coach_id INTO v_coach_id;
    
    -- Если указана команда, назначаем тренера
    IF p_team_id IS NOT NULL THEN
        BEGIN
            UPDATE team SET coach_id = v_coach_id 
            WHERE team_id = p_team_id;
        EXCEPTION 
            WHEN OTHERS THEN
                RAISE NOTICE 'Не удалось назначить тренера команде: %', SQLERRM;
        END;
    END IF;
END;
$$ LANGUAGE plpgsql

-- Обновление данных тренера
CREATE OR REPLACE PROCEDURE delete_coach(
    p_coach_id INT
)
AS $$
BEGIN
    UPDATE team SET coach_id = NULL 
    WHERE coach_id = p_coach_id;
    
    DELETE FROM coach WHERE coach_id = p_coach_id;
END;
$$ LANGUAGE plpgsql;

-- Комбинированная процедура (если нужно обновить всё сразу)
CREATE OR REPLACE PROCEDURE update_coach_team(
    p_coach_id INT,
    p_first_name TEXT DEFAULT NULL,
    p_last_name TEXT DEFAULT NULL,
    p_team_id INT DEFAULT NULL
)
AS $$
BEGIN
    -- Шаг 1: Отвязываем тренера от текущей команды (если есть)
    UPDATE team SET coach_id = NULL 
    WHERE coach_id = p_coach_id;
    
    -- Шаг 2: Привязываем к новой команде (если указана)
    IF p_team_id IS NOT NULL THEN
        -- Проверка существования команды
        IF NOT EXISTS (SELECT 1 FROM team WHERE team_id = p_team_id) THEN
            RAISE EXCEPTION 'Команда с ID % не существует', p_team_id;
        END IF;
        
        -- Обновление coach_id в команде
        UPDATE team SET coach_id = p_coach_id 
        WHERE team_id = p_team_id;
    END IF;

    -- Шаг 3: Обновление имени и фамилии тренера (если переданы)
    IF p_first_name IS NOT NULL OR p_last_name IS NOT NULL THEN
        UPDATE coach 
        SET 
            first_name = COALESCE(p_first_name, first_name), 
            last_name = COALESCE(p_last_name, last_name)
        WHERE coach_id = p_coach_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

CALL update_coach_team(1, 'd','d', 20)



