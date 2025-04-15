DROP FUNCTION get_playground_views

CREATE OR REPLACE FUNCTION get_playground_views(
    p_season_id INT DEFAULT NULL,
    p_week_ids INT[] DEFAULT NULL
)
RETURNS TABLE (
    playground_id INT,
    playground_name VARCHAR(150),
    week_id INT,
    week_start_date DATE,
    week_end_date DATE,
    total_views BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pg.playground_id,
        pg.playground_name,
        w.week_id,
        w.start_date AS week_start_date,
        w.end_date AS week_end_date,
        COALESCE(SUM(mi.views_count), 0)::BIGINT AS total_views
    FROM 
        playground pg
    JOIN 
        match m ON pg.playground_id = m.playground_id
    JOIN 
        match_info mi ON m.match_info_id = mi.match_info_id
    JOIN 
        match_status ms ON mi.match_status_id = ms.match_status_id
    JOIN 
        match_status_type mt ON ms.match_status_type_id = mt.match_status_type_id
    JOIN 
        week w ON m.week_id = w.week_id
    WHERE 
		(p_season_id IS NULL OR w.season_id = p_season_id)
        AND (p_week_ids IS NULL OR w.week_id = ANY(p_week_ids))
    GROUP BY 
        pg.playground_id, pg.playground_name, w.week_id, w.start_date, w.end_date
    ORDER BY 
        w.week_id, total_views DESC;
END;
$$ LANGUAGE plpgsql;


SELECT * FROM get_playground_views(6);

SELECT * FROM match_info
SELECT * FROM match_status
SELECT * FROM match_status_type