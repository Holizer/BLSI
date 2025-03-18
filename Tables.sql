-- CREATE SCHEMA location;
-- CREATE SCHEMA players;
-- CREATE SCHEMA teams;
-- CREATE SCHEMA seasons;
-- CREATE SCHEMA playgrounds;
-- CREATE SCHEMA matches;

-- Город
CREATE TABLE location.city (
    city_id SERIAL PRIMARY KEY,
    city_name VARCHAR(150) NOT NULL
);

-- Адрес
CREATE TABLE location.address (
    address_id SERIAL PRIMARY KEY,
    city_id INT NOT NULL,
    street VARCHAR(150) NOT NULL,
    house_number INT NOT NULL,
    postal_code INT NOT NULL,
    FOREIGN KEY (city_id) REFERENCES location.city(city_id)
);

-- Капитан команды
CREATE TABLE teams.captain (
    captain_id SERIAL PRIMARY KEY,
    player_id INT NOT NULL
);

-- Тренер команды
CREATE TABLE teams.coach (
    coach_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL
);

-- Команда
CREATE TABLE teams.team (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(100) UNIQUE NOT NULL,
	captain_id INT,
	coach_id INT, 
	FOREIGN KEY (captain_id) REFERENCES teams.captain(captain_id),
	FOREIGN KEY (coach_id) REFERENCES teams.coach(coach_id)
);

-- Игрок
CREATE TABLE players.player (
    player_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    age INT DEFAULT 18 NOT NULL CHECK (age BETWEEN 18 AND 99),
    address_id INT,
    team_id INT,
    FOREIGN KEY (address_id) REFERENCES location.address(address_id),
	FOREIGN KEY (team_id) REFERENCES teams.team(team_id)
);

-- Статистика игрока
CREATE TABLE players.player_stats (
    player_stats_id SERIAL PRIMARY KEY,
    total_points INT DEFAULT 0 NOT NULL,
    average_points INT DEFAULT 0 NOT NULL,
    total_games INT DEFAULT 0 NOT NULL,
    handicap FLOAT DEFAULT 0 NOT NULL
);

-- Связь между игроком и его статистикой по неделям
CREATE TABLE players.player_player_stats (
    player_stats_id INT NOT NULL,
    player_id INT NOT NULL,
    week_id INT NOT NULL,
    season_id INT NOT NULL,
    PRIMARY KEY (player_id, week_id, season_id),
    FOREIGN KEY (player_stats_id) REFERENCES players.player_stats(player_stats_id),
    FOREIGN KEY (player_id) REFERENCES players.player(player_id)
);



-- Статистика команды
CREATE TABLE teams.team_stats (
    team_stats_id SERIAL PRIMARY KEY,
    wins INT DEFAULT 0 NOT NULL,
    losses INT DEFAULT 0 NOT NULL,
    draws INT DEFAULT 0 NOT NULL,
    total_points INT DEFAULT 0 NOT NULL
);

-- Связь команды со статистикой за определенную неделю
CREATE TABLE teams.team_team_stats (
    team_id INT NOT NULL,
    week_id INT NOT NULL,
    season_id INT NOT NULL,
    team_stats_id INT NOT NULL,
    PRIMARY KEY (team_id, week_id, season_id),
    FOREIGN KEY (team_id) REFERENCES teams.team(team_id),
    FOREIGN KEY (team_stats_id) REFERENCES teams.team_stats(team_stats_id)
);

-- Сезон
CREATE TABLE seasons.season (
    season_id SERIAL PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

-- Игровая неделя
CREATE TABLE seasons.week (
    week_id SERIAL PRIMARY KEY,
    season_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    FOREIGN KEY (season_id) REFERENCES seasons.season(season_id)
);

-- Игровая площадка
CREATE TABLE playgrounds.playground (
    playground_id SERIAL PRIMARY KEY,
    playground_name VARCHAR(150) NOT NULL,
    capacity INT DEFAULT 0 NOT NULL
);

-- Типы игровых площадок
CREATE TABLE playgrounds.playground_type (
    playground_type_id SERIAL PRIMARY KEY,
    playground_type VARCHAR(50) NOT NULL
);

-- Связь между площадками и их типами
CREATE TABLE playgrounds.playground_playground_type (
    playground_type_id INT NOT NULL,
    playground_id INT NOT NULL,
    PRIMARY KEY (playground_type_id, playground_id),
    FOREIGN KEY (playground_type_id) REFERENCES playgrounds.playground_type(playground_type_id),
    FOREIGN KEY (playground_id) REFERENCES playgrounds.playground(playground_id)
);

-- Причины отмены матча
CREATE TABLE matches.cancellation_reason (
    cancellation_reason_id SERIAL PRIMARY KEY,
    reason VARCHAR(200) NOT NULL
);

-- Тип статуса матча
CREATE TABLE matches.match_status_type (
    match_status_type_id SERIAL PRIMARY KEY,
    match_status_type VARCHAR(50) NOT NULL
);

-- Статус матча
CREATE TABLE matches.match_status (
    match_status_id SERIAL PRIMARY KEY,
    match_status_type_id INT NOT NULL,
    cancellation_reason_id INT NULL,
	forfeiting_team_id INT NULL,
    FOREIGN KEY (match_status_type_id) REFERENCES matches.match_status_type(match_status_type_id),
    FOREIGN KEY (cancellation_reason_id) REFERENCES matches.cancellation_reason(cancellation_reason_id)
);

-- Информация о матче
CREATE TABLE matches.match_info (
    match_info_id SERIAL PRIMARY KEY,
    match_status_id INT NOT NULL,
    team1_id INT NOT NULL,
    team2_id INT NOT NULL,
    winning_team_id INT NULL,
    team1_points INT DEFAULT 0 NOT NULL,
    team2_points INT DEFAULT 0 NOT NULL,
    views_count INT DEFAULT 0,
    match_duration TIME DEFAULT '00:00' NOT NULL,
    event_time TIME NOT NULL,
    event_date DATE NOT NULL,
    FOREIGN KEY (match_status_id) REFERENCES matches.match_status(match_status_id)
);

-- Матчи
CREATE TABLE matches.match (
    match_id SERIAL PRIMARY KEY,
    week_id INT NOT NULL,
    playground_id INT NOT NULL,
    match_info_id INT NOT NULL,
    FOREIGN KEY (week_id) REFERENCES seasons.week(week_id),
    FOREIGN KEY (match_info_id) REFERENCES matches.match_info(match_info_id),
    FOREIGN KEY (playground_id) REFERENCES playgrounds.playground(playground_id)
);

-- Статистика команды за сыгранный матч
CREATE TABLE teams.team_match_stats (
    team_match_stats_id SERIAL PRIMARY KEY,
    match_id INT NOT NULL,
    scored_points INT NOT NULL,
    match_result VARCHAR(10) NOT NULL,
  	FOREIGN KEY (match_id) REFERENCES matches.match(match_id)
);

-- Связь команды с их статистикой за матч
CREATE TABLE teams.team_team_match_stats (
    team_match_stats_id INT NOT NULL,
    team_id INT NOT NULL,
	PRIMARY KEY (team_match_stats_id, team_id),
	FOREIGN KEY (team_id) REFERENCES teams.team(team_id),
    FOREIGN KEY (team_match_stats_id) REFERENCES teams.team_match_stats(team_match_stats_id)
);

-- Статистика команды за сыгранный матч
CREATE TABLE players.player_match_stats (
    player_match_stats_id SERIAL PRIMARY KEY,
    match_id INT NOT NULL,
    scored_points INT NOT NULL
);

CREATE TABLE players.player_player_match_stats (
    player_match_stats_id INT NOT NULL,
    player_id INT NOT NULL,
	PRIMARY KEY (player_match_stats_id, player_id),
	FOREIGN KEY (player_id) REFERENCES players.player(player_id),
    FOREIGN KEY (player_match_stats_id) REFERENCES players.player_match_stats(player_match_stats_id)
);