DROP FUNCTION get_players_season_progress

CREATE OR REPLACE FUNCTION get_players_season_progress(
    p_first_season_id INT,
    p_second_season_id INT
)
RETURNS TABLE (
    player_id INT,
    player_name VARCHAR(150),
    team_name VARCHAR(100),
    first_season_id INT,
    first_season_name VARCHAR(100),
    second_season_id INT,
    second_season_name VARCHAR(100),
    first_season_avg_points NUMERIC(10,2),
    second_season_avg_points NUMERIC(10,2),
    points_diff NUMERIC(10,2),
    improvement_percentage NUMERIC(10,2),
    first_season_handicap NUMERIC(10,2),
    second_season_handicap NUMERIC(10,2),
    handicap_diff NUMERIC(10,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH players_with_both_seasons AS (
        SELECT pps.player_id
        FROM player_player_stats pps
        WHERE pps.season_id IN (p_first_season_id, p_second_season_id)
        GROUP BY pps.player_id
        HAVING COUNT(DISTINCT pps.season_id) = 2
    ),
    player_season_stats AS (
        SELECT 
            p.player_id,
            CONCAT(p.first_name, ' ', p.last_name)::VARCHAR(150) AS player_name,
            t.team_name::VARCHAR(100) AS team_name,
            s.season_id,
            s.season_name::VARCHAR(100) AS season_name,
            ROUND(AVG(ps.average_points)::NUMERIC, 2) AS season_avg_points,
            ROUND(AVG(ps.handicap)::NUMERIC, 2) AS season_handicap
        FROM player_player_stats pps
        JOIN player_stats ps ON pps.player_stats_id = ps.player_stats_id
        JOIN player p ON pps.player_id = p.player_id
        JOIN team t ON p.team_id = t.team_id
        JOIN season s ON pps.season_id = s.season_id
        JOIN players_with_both_seasons pbs ON p.player_id = pbs.player_id
        WHERE s.season_id IN (p_first_season_id, p_second_season_id)
        GROUP BY p.player_id, p.first_name, p.last_name, t.team_name, s.season_id, s.season_name
    ),
    first_season_stats AS (
        SELECT * FROM player_season_stats WHERE season_id = p_first_season_id
    ),
    second_season_stats AS (
        SELECT * FROM player_season_stats WHERE season_id = p_second_season_id
    )
    SELECT 
        fss.player_id,
        fss.player_name,
        fss.team_name,
        fss.season_id,
        fss.season_name,
        sss.season_id,
        sss.season_name,
        fss.season_avg_points,
        sss.season_avg_points,
        ROUND((sss.season_avg_points - fss.season_avg_points)::NUMERIC, 2) AS points_diff,
        ROUND(((sss.season_avg_points - fss.season_avg_points) / NULLIF(fss.season_avg_points, 0)) * 100, 2) AS improvement_percentage,
        fss.season_handicap,
        sss.season_handicap,
        ROUND((sss.season_handicap - fss.season_handicap)::NUMERIC, 2) AS handicap_diff
    FROM first_season_stats fss
    JOIN second_season_stats sss ON fss.player_id = sss.player_id;
END;
$$;


SELECT * FROM player
SELECT * FROM season 
-- Пример вызова функции для сравнения прогресса игрока с ID=1 между сезонами 1 и 2
SELECT * FROM get_players_season_progress(6, 7);


SELECT * FROM get_teams_season_progress(6, 7);
CREATE OR REPLACE FUNCTION get_teams_season_progress(
    p_first_season_id INT,
    p_second_season_id INT
)
RETURNS TABLE (
    team_id INT,
    team_name VARCHAR(100),
    first_season_id INT,
    first_season_name VARCHAR(100),
    second_season_id INT,
    second_season_name VARCHAR(100),
    first_season_wins INT,
    second_season_wins INT,
    wins_diff INT,
    first_season_losses INT,
    second_season_losses INT,
    losses_diff INT,
    first_season_draws INT,
    second_season_draws INT,
    draws_diff INT,
    first_season_total_points NUMERIC(10,2),
    second_season_total_points NUMERIC(10,2),
    points_diff NUMERIC(10,2),
    improvement_percentage NUMERIC(10,2),
    first_season_avg_points NUMERIC(10,2),
    second_season_avg_points NUMERIC(10,2),
    avg_points_diff NUMERIC(10,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH teams_with_both_seasons AS (
        SELECT DISTINCT t.team_id
        FROM team_team_stats tts
        JOIN team t ON tts.team_id = t.team_id
        JOIN week w ON tts.week_id = w.week_id
        WHERE w.season_id IN (p_first_season_id, p_second_season_id)
        GROUP BY t.team_id
        HAVING COUNT(DISTINCT w.season_id) = 2
    ),
    team_season_stats AS (
        SELECT 
            t.team_id,
            t.team_name,
            s.season_id,
            s.season_name,
		 	SUM(ts.wins)::INT AS season_wins,
			SUM(ts.losses)::INT AS season_losses,
			SUM(ts.draws)::INT AS season_draws,
			SUM(ts.total_points)::NUMERIC(10,2) AS season_total_points,
            ROUND(AVG(ts.total_points), 2) AS season_avg_points
        FROM team_team_stats tts
        JOIN team_stats ts ON tts.team_stats_id = ts.team_stats_id
        JOIN team t ON tts.team_id = t.team_id
        JOIN week w ON tts.week_id = w.week_id
        JOIN season s ON w.season_id = s.season_id
        JOIN teams_with_both_seasons tbs ON t.team_id = tbs.team_id
        WHERE s.season_id IN (p_first_season_id, p_second_season_id)
        GROUP BY t.team_id, t.team_name, s.season_id, s.season_name
    ),
    first_season_stats AS (
        SELECT * FROM team_season_stats WHERE season_id = p_first_season_id
    ),
    second_season_stats AS (
        SELECT * FROM team_season_stats WHERE season_id = p_second_season_id
    )
    SELECT 
        fss.team_id,
        fss.team_name,
        fss.season_id,
        fss.season_name,
        sss.season_id,
        sss.season_name,
        fss.season_wins,
        sss.season_wins,
        (sss.season_wins - fss.season_wins),
        fss.season_losses,
        sss.season_losses,
        (sss.season_losses - fss.season_losses),
        fss.season_draws,
        sss.season_draws,
        (sss.season_draws - fss.season_draws),
        fss.season_total_points,
        sss.season_total_points,
        ROUND((sss.season_total_points - fss.season_total_points), 2),
        ROUND(CASE 
            WHEN fss.season_total_points = 0 THEN NULL
            ELSE ((sss.season_total_points - fss.season_total_points) / fss.season_total_points) * 100
        END, 2),
        fss.season_avg_points,
        sss.season_avg_points,
        ROUND((sss.season_avg_points - fss.season_avg_points), 2)
    FROM first_season_stats fss
    JOIN second_season_stats sss ON fss.team_id = sss.team_id;
END;
$$ LANGUAGE plpgsql;
