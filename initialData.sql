INSERT INTO city (city_name) VALUES
('Минск'),
('Гомель'),
('Могилев'),
('Витебск'),
('Гродно');

INSERT INTO address (city_id, street, house_number, postal_code) VALUES
(1, 'Независимости проспект', 15, 220000),
(2, 'Советская улица', 25, 246000),
(3, 'Ленинский проспект', 10, 212000),
(4, 'Суворова улица', 5, 210000),
(5, 'Карла Маркса улица', 12, 230000);

INSERT INTO captain (player_id) VALUES
(1),
(2),
(3),
(4),
(5);

INSERT INTO coach (first_name, last_name) VALUES
('Алексей', 'Иванов'),
('Дмитрий', 'Петров'),
('Сергей', 'Кузнецов'),
('Владимир', 'Смирнов'),
('Игорь', 'Попов');

INSERT INTO team (team_name, captain_id, coach_id) VALUES
('Команда А', 1, 1),
('Команда Б', 2, 2),
('Команда В', 3, 3),
('Команда Г', 4, 4),
('Команда Д', 5, 5);

INSERT INTO player (first_name, last_name, phone, age, address_id, team_id) VALUES
('Александр', 'Пимпл', '375291234567', 25, 1, 1),
('Дмитрий', 'Митрий', '375291234568', 28, 2, 2),
('Сергей', 'Йегрес', '375291234569', 30, 3, 3),
('Максим', 'Балпа', '375291234570', 22, 4, 4),
('Иван', 'Додеп', '375291234571', 27, 5, 5);

-- Заполнение таблицы "player_stats" (статистика игроков)
INSERT INTO player_stats (total_points, average_points, total_games, handicap) VALUES
(120, 30, 4, 1.5),
(100, 25, 5, 2.0),
(150, 37, 5, 1.2),
(80, 20, 4, 1.8),
(110, 27, 5, 1.6);

-- Заполнение таблицы "player_player_stats" (связь между игроком и его статистикой по неделям)
-- Для этого необходимо знать id сезонов и недель. Например, можно использовать следующие данные:
-- Пусть у нас есть сезон с season_id = 1 и неделя с week_id = 1

INSERT INTO player_player_stats (player_stats_id, player_id, week_id, season_id) VALUES
(1, 1, 1, 1),
(2, 2, 1, 1),
(3, 3, 1, 1),
(4, 4, 1, 1),
(5, 5, 1, 1);
