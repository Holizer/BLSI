DROP FUNCTION get_cancellation_reasons()

CREATE OR REPLACE FUNCTION get_cancellation_reasons()
RETURNS SETOF cancellation_reason
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM cancellation_reason
    ORDER BY cancellation_reason_id;
END;
$$;


SELECT * FROM get_cancellation_reasons()


CREATE OR REPLACE PROCEDURE add_cancellation_reason(
    p_reason VARCHAR(200)
)
AS $$
BEGIN
    INSERT INTO cancellation_reason (reason)
    VALUES (p_reason);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE update_cancellation_reason(
    p_reason_id INT,
    p_new_reason VARCHAR(200))
AS $$
BEGIN
    UPDATE cancellation_reason
    SET reason = p_new_reason
    WHERE cancellation_reason_id = p_reason_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Причина отмены с ID % не найдена', p_reason_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

CALL add_cancellation_reason('Реконструкция площадки');
CALL update_cancellation_reason(3, 'Технические неполадки');
CALL delete_cancellation_reason(7);

CREATE OR REPLACE PROCEDURE delete_cancellation_reason(
    p_reason_id INT)
AS $$
DECLARE
    v_used_in_status INT;
BEGIN
    -- Проверяем, используется ли причина в статусах матчей
    SELECT COUNT(*) INTO v_used_in_status
    FROM match_status
    WHERE cancellation_reason_id = p_reason_id;
    
    IF v_used_in_status > 0 THEN
        RAISE EXCEPTION 'Нельзя удалить причину отмены, так как она используется в % матчах', v_used_in_status;
    END IF;
    
    DELETE FROM cancellation_reason
    WHERE cancellation_reason_id = p_reason_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Причина отмены с ID % не найдена', p_reason_id;
    END IF;
END;
$$ LANGUAGE plpgsql;