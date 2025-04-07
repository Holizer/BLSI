CREATE OR REPLACE PROCEDURE create_match(
    p_week_id INT,
    p_playground_id INT,
    p_team1_id INT,
    p_team2_id INT,
    p_event_date DATE,
    p_event_time TIME
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_match_status_id INT;
    v_match_info_id INT;
    v_match_id INT;
BEGIN
    -- Создаем статус матча (по умолчанию "запланирован")
    INSERT INTO match_status (match_status_type_id, cancellation_reason_id, forfeiting_team_id)
    VALUES (1, NULL, NULL) -- 1 = 'запланирован'
    RETURNING match_status_id INTO v_match_status_id;
    
    -- Создаем информацию о матче
    INSERT INTO match_info (
        match_status_id, team1_id, team2_id, winning_team_id,
        team1_points, team2_points, views_count, match_duration,
        event_time, event_date
    ) VALUES (
        v_match_status_id, p_team1_id, p_team2_id, NULL,
        0, 0, 0, '00:00',
        p_event_time, p_event_date
    )
    RETURNING match_info_id INTO v_match_info_id;
    
    -- Создаем сам матч
    INSERT INTO match (week_id, playground_id, match_info_id)
    VALUES (p_week_id, p_playground_id, v_match_info_id)
    RETURNING match_id INTO v_match_id;
    
    -- Создаем статистику для команд
    INSERT INTO team_match_stats (match_id, scored_points, match_result)
    VALUES (v_match_id, 0, 'pending');
    
    INSERT INTO team_match_stats (match_id, scored_points, match_result)
    VALUES (v_match_id, 0, 'pending');
    
    -- Связываем статистику с командами
    INSERT INTO team_team_match_stats (team_match_stats_id, team_id)
    VALUES (currval('team_match_stats_team_match_stats_id_seq')-1, p_team1_id);
    
    INSERT INTO team_team_match_stats (team_match_stats_id, team_id)
    VALUES (currval('team_match_stats_team_match_stats_id_seq'), p_team2_id);
    
    COMMIT;
END;
$$;