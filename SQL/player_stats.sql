DROP FUNCTION get_season_players_best_game

CREATE OR REPLACE FUNCTION get_season_players_best_game(
    p_season_id INT DEFAULT NULL
)
RETURNS TABLE (
    player_id INT,
    player_name TEXT,
    max_scored_points INT,
    match_id INT,
    season_id INT,
    season_name VARCHAR,
    week_id INT,
    week_start_date DATE,
    week_end_date DATE
) AS $$
BEGIN
    RETURN QUERY
    WITH best_games AS (
        SELECT 
            p.player_id,
            (p.first_name || ' ' || p.last_name)::TEXT AS player_name,
            pms.scored_points AS max_scored_points,
            m.match_id,
            s.season_id,
            s.season_name,
            w.week_id,
            w.start_date AS week_start_date,
            w.end_date AS week_end_date,
            ROW_NUMBER() OVER (PARTITION BY p.player_id ORDER BY pms.scored_points DESC) AS rank
        FROM 
            player p
        JOIN 
            player_player_match_stats ppms ON p.player_id = ppms.player_id
        JOIN 
            player_match_stats pms ON ppms.player_match_stats_id = pms.player_match_stats_id
        JOIN 
            match m ON pms.match_id = m.match_id
        JOIN 
            week w ON m.week_id = w.week_id
        JOIN 
            season s ON w.season_id = s.season_id
        WHERE
            (p_season_id IS NULL OR s.season_id = p_season_id)
    )
    SELECT 
        best_games.player_id,
        best_games.player_name,
        best_games.max_scored_points,
        best_games.match_id,
        best_games.season_id,
        best_games.season_name,
        best_games.week_id,
        best_games.week_start_date,
        best_games.week_end_date
    FROM 
        best_games
    WHERE 
        best_games.rank = 1
    ORDER BY 
        best_games.player_id;
END;
$$ LANGUAGE plpgsql;



SELECT * FROM get_season_players_best_game(6)
