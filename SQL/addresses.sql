CREATE OR REPLACE VIEW player_address_view AS
SELECT 
    p.player_id,
    p.first_name,
	p.last_name,
    c.city_id,
    c.city_name,
    a.street,
    a.house_number,
    a.postal_code
FROM 
    player p
LEFT JOIN 
    address a ON p.address_id = a.address_id
LEFT JOIN 
    city c ON a.city_id = c.city_id;
	
-- DROP FUNCTION get_player_address
CREATE OR REPLACE FUNCTION get_player_address()
RETURNS TABLE (
    player_id INT,
    first_name VARCHAR,
    last_name VARCHAR,
    city_id INT,
    city_name VARCHAR,
    street VARCHAR,
    house_number INT,
    postal_code INT
) AS $$
BEGIN
    RETURN QUERY SELECT * FROM player_address_view ORDER BY player_id;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM get_player_address()

CREATE OR REPLACE PROCEDURE delete_player_address(
    p_player_id INT
) AS $$
BEGIN
    DELETE FROM address
    WHERE address_id IN (SELECT address_id FROM player WHERE player_id = p_player_id);
    
    DELETE FROM player
    WHERE player_id = p_player_id;
    
    -- DELETE FROM city WHERE city_id NOT IN (SELECT city_id FROM address);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE update_player_address(
    p_player_id INT,
    p_new_first_name VARCHAR,
    p_new_last_name VARCHAR,
    p_new_city_id INT,
    p_new_street VARCHAR,
    p_new_house_number INT,
    p_new_postal_code INT
) AS $$
BEGIN
    UPDATE address
    SET 
        city_id = p_new_city_id,
        street = p_new_street,
        house_number = p_new_house_number,
        postal_code = p_new_postal_code
    WHERE address_id IN (SELECT address_id FROM player WHERE player_id = p_player_id);

    UPDATE player
    SET 
        first_name = p_new_first_name,
        last_name = p_new_last_name
    WHERE player_id = p_player_id;
    
END;
$$ LANGUAGE plpgsql;



--- ГОРОДА
CREATE OR REPLACE FUNCTION get_cities()
RETURNS TABLE (
    city_id INT,
    city_name VARCHAR(150)
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY 
    SELECT c.city_id, c.city_name
    FROM city c
    ORDER BY c.city_name;
END;
$$;

CREATE OR REPLACE PROCEDURE create_city(
    p_city_name VARCHAR(150)
) AS $$
BEGIN
    INSERT INTO city (city_name)
    VALUES (p_city_name);
END;
$$ LANGUAGE plpgsql;

SELECT * FROM City


CREATE OR REPLACE PROCEDURE update_city_name(
    p_city_id INT,
    p_city_name VARCHAR(150)
) AS $$
BEGIN
    UPDATE city
    SET city_name = p_city_name
    WHERE city_id = p_city_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE delete_city(
    p_city_id INT
) AS $$
BEGIN
    DELETE FROM address WHERE city_id = p_city_id;
    
    DELETE FROM city WHERE city_id = p_city_id;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION check_city_exists(
    p_city_name VARCHAR,
    p_exclude_id INT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    IF p_exclude_id IS NULL THEN
        SELECT EXISTS(SELECT 1 FROM city WHERE city_name = p_city_name) INTO v_exists;
    ELSE
        SELECT EXISTS(SELECT 1 FROM city WHERE city_name = p_city_name AND city_id != p_exclude_id) INTO v_exists;
    END IF;
    
    RETURN v_exists;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION check_city_name_trigger()
RETURNS TRIGGER
AS $$
BEGIN
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.city_name <> OLD.city_name) THEN
        IF check_city_exists(NEW.city_name, 
                                 CASE WHEN TG_OP = 'UPDATE' THEN NEW.city_id ELSE NULL END) THEN
            RAISE EXCEPTION 'Город "%" уже существует', NEW.city_name;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_city_name_unique
BEFORE INSERT OR UPDATE OF city_name ON city
FOR EACH ROW
EXECUTE FUNCTION check_city_name_trigger();



