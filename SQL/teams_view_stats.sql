CREATE OR REPLACE VIEW team_weekly_stats_view AS
SELECT 
    t.team_id,
    t.team_name,
    w.week_id,
    w.start_date AS week_start_date,
    w.end_date AS week_end_date,
    s.season_id,
    s.season_name,
    ts.wins,
    ts.losses,
    ts.draws,
    ts.total_points
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
LEFT JOIN 
    captain cap ON t.captain_id = cap.captain_id
LEFT JOIN 
    player p ON cap.player_id = p.player_id
LEFT JOIN 
    coach ch ON t.coach_id = ch.coach_id
ORDER BY 
    s.season_id, w.week_id, ts.total_points DESC;

SELECT * FROM team_weekly_stats_view

CREATE OR REPLACE FUNCTION get_team_week_stats(p_team_id INT, p_week_id INT)
RETURNS TABLE (
    team_id INT,
    team_name VARCHAR(100),
    week_id INT,
    matches_played INT,
    wins INT,
    losses INT,
    draws INT,
    total_points_scored INT,
    average_points_per_match NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.team_id,
        t.team_name,
        w.week_id,
        COUNT(*) AS matches_played,
        SUM(CASE WHEN tms.match_result_type = 'Победа' THEN 1 ELSE 0 END) AS wins,
        SUM(CASE WHEN tms.match_result_type = 'Поражение' THEN 1 ELSE 0 END) AS losses,
        SUM(CASE WHEN tms.match_result_type = 'Ничья' THEN 1 ELSE 0 END) AS draws,
        SUM(tms.scored_points) AS total_points_scored,
        ROUND(AVG(tms.scored_points), 2) AS average_points_per_match
    FROM 
        team t
    JOIN 
        team_team_match_stats ttms ON t.team_id = ttms.team_id
    JOIN 
        team_match_stats tms ON ttms.team_match_stats_id = tms.team_match_stats_id
    JOIN 
        match m ON tms.match_id = m.match_id
    JOIN 
        week w ON m.week_id = w.week_id
    WHERE 
        t.team_id = p_team_id AND w.week_id = p_week_id
    GROUP BY 
        t.team_id, t.team_name, w.week_id;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM get_team_week_stats(36, 41);
SELECT * FROM team_match_stats();

