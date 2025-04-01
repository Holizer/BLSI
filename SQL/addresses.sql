CREATE OR REPLACE VIEW player_address_view AS
SELECT 
    p.player_id,
    p.first_name,
	p.last_name,
    a.street,
    a.house_number,
    a.postal_code,
    c.city_id,
    c.city_name
FROM 
    player p
LEFT JOIN 
    address a ON p.address_id = a.address_id
LEFT JOIN 
    city c ON a.city_id = c.city_id;
	
	
SELECT * FROM player_address_view