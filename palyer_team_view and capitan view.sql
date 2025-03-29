SELECT * FROM player_team_view
ORDER BY player_id ASC 

CREATE VIEW player_team_view as
SELECT 
    p.player_id,
    p.first_name,
    p.last_name,
    t.team_id,
    t.team_name
FROM 
    player p
LEFT JOIN team t ON p.team_id = t.team_id;

-- Получение данных
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


-- Процедура для обновления
CREATE OR REPLACE PROCEDURE update_player(
    p_player_id INT,
    p_first_name VARCHAR(50) DEFAULT NULL,
    p_last_name VARCHAR(50) DEFAULT NULL,
    p_team_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE player
    SET 
        first_name = COALESCE(p_first_name, first_name),
        last_name = COALESCE(p_last_name, last_name),
        team_id = COALESCE(p_team_id, team_id)
    WHERE player_id = p_player_id;
    
    COMMIT;
    RAISE NOTICE 'Игрок с ID % успешно обновлен', p_player_id;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE EXCEPTION 'Ошибка при обновлении игрока: %', SQLERRM;
END;
$$;

-- Процедура для удаления
CREATE OR REPLACE PROCEDURE delete_captain(
    p_player_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_address_id INT;
    v_is_captain BOOLEAN;
    v_team_id INT;
BEGIN
    -- Получаем информацию об игроке
    SELECT address_id, team_id INTO v_address_id, v_team_id 
    FROM player 
    WHERE player_id = p_player_id;
    
    -- Проверяем, является ли игрок капитаном
    SELECT EXISTS (
        SELECT 1 FROM captain cap 
        JOIN team t ON cap.captain_id = t.captain_id 
        WHERE cap.player_id = p_player_id
    ) INTO v_is_captain;
    
    -- Начинаем транзакцию
    BEGIN
        -- Если игрок - капитан, сначала удаляем его из капитанов
        IF v_is_captain THEN
            -- Находим ID записи капитана
            DECLARE
                v_captain_id INT;
            BEGIN
                SELECT cap.captain_id INTO v_captain_id
                FROM captain cap
                JOIN team t ON cap.captain_id = t.captain_id
                WHERE cap.player_id = p_player_id;
                
                -- Удаляем связь команды с капитаном
                UPDATE team SET captain_id = NULL WHERE captain_id = v_captain_id;
                
                -- Удаляем запись капитана
                DELETE FROM captain WHERE captain_id = v_captain_id;
                
                RAISE NOTICE 'Игрок с ID % был капитаном команды. Капитан удален.', p_player_id;
            END;
        END IF;
        
        -- Удаляем связи игрока со статистикой
        DELETE FROM player_player_stats WHERE player_id = p_player_id;
        DELETE FROM player_player_match_stats WHERE player_id = p_player_id;
        
        -- Удаляем игрока
        DELETE FROM player WHERE player_id = p_player_id;
        
        -- Удаляем адрес игрока (если есть)
        IF v_address_id IS NOT NULL THEN
            DELETE FROM address WHERE address_id = v_address_id;
        END IF;
        
        COMMIT;
        RAISE NOTICE 'Игрок с ID % успешно удален', p_player_id;
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE EXCEPTION 'Ошибка при удалении игрока: %', SQLERRM;
    END;
END;
$$;

CREATE OR REPLACE VIEW captains_view AS
SELECT 
    p.player_id,
    p.first_name,
    p.last_name,
    t.team_id,
    t.team_name
FROM 
    captain cap
JOIN player p ON cap.player_id = p.player_id
JOIN team t ON cap.captain_id = t.captain_id

SELECT * FROM captains_view
