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

SELECT * FROM get_player_team();

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

-- ТРИГЕР
CREATE TRIGGER trg_check_phone_unique
BEFORE INSERT OR UPDATE OF phone ON player
FOR EACH ROW
EXECUTE FUNCTION check_phone_uniqueness();

CALL check_phone_exists('3752912345683', NULL, 1);