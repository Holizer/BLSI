DROP FUNCTION IF EXISTS get_teams_statistic;

CREATE OR REPLACE FUNCTION get_teams_statistic(
    p_season_id INT DEFAULT NULL,
    p_week_ids INT[] DEFAULT NULL
)
RETURNS TABLE (
    rank INT,
    team_id INT,
    team_name TEXT,
    wins INT,
    losses INT,
    draws INT,
    total_points INT,
    win_percentage FLOAT,
    season_id INT,
    season_name VARCHAR,
    week_id INT,
    week_start_date DATE,
    week_end_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        RANK() OVER (
            PARTITION BY s.season_id 
            ORDER BY ts.total_points DESC
        )::INT AS rank, 
        t.team_id,
        t.team_name::TEXT,
        ts.wins,
        ts.losses,
        ts.draws,
        ts.total_points,
        CASE 
            WHEN (ts.wins + ts.losses + ts.draws) = 0 THEN 0
            ELSE ROUND(((ts.wins::FLOAT / (ts.wins + ts.losses + ts.draws)) * 100)::numeric, 2)::double precision
        END AS win_percentage,
        s.season_id,
        s.season_name,
        w.week_id,
        w.start_date AS week_start_date,
        w.end_date AS week_end_date
    FROM 
        team t
    JOIN 
        team_team_stats tts ON t.team_id = tts.team_id
    JOIN 
        team_stats ts ON tts.team_stats_id = ts.team_stats_id
    JOIN 
        week w ON tts.week_id = w.week_id
    JOIN 
        season s ON w.season_id = s.season_id
    WHERE
        (p_season_id IS NULL OR s.season_id = p_season_id)
    AND (
        p_week_ids IS NULL OR 
        COALESCE(array_length(p_week_ids, 1), 0) = 0 OR 
        w.week_id = ANY(p_week_ids) 
    )
    ORDER BY rank;
END;
$$ LANGUAGE plpgsql;


SELECT * FROM get_teams_statistic()