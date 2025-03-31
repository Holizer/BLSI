SELECT * FROM player_team_view
ORDER BY player_id ASC 

CREATE OR REPLACE VIEW player_team_view AS
SELECT 
    p.player_id,
    p.first_name,
    p.last_name,
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
