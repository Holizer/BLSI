from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from collections import defaultdict
from src.schemas.season import (
    SeasonWithWeeks,
    UpdateSeason,
    CreateSeason
)

from src.schemas.stats import (
    TeamStatistic,
    PlayerStatistic,
    SeasonPlaygroundViews,
    PlayerSeasonProgress,
    TeamSeasonProgress,
    SeasonPlayerBestGame
)


class SeasonRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_seasons_with_weeks(self):
        query = text("SELECT * FROM get_seasons_with_weeks()")
        result = self.db.execute(query)
        
        seasons_data = defaultdict(lambda: {'weeks': []})
        
        for row in result.mappings():
            season_id = row['season_id']
            week_data = {
                'week_id': row['week_id'],
                'week_number': row['week_number'],
                'week_start': row['week_start'],
                'week_end': row['week_end']
            }
            seasons_data[season_id]['season_id'] = row['season_id']
            seasons_data[season_id]['season_name'] = row['season_name']
            seasons_data[season_id]['season_start'] = row['season_start']
            seasons_data[season_id]['season_end'] = row['season_end']
            seasons_data[season_id]['weeks'].append(week_data)
        
        return [
            SeasonWithWeeks(**season) 
            for season in seasons_data.values()
        ]



    def update_season(self, season_id: int, season_data: UpdateSeason):
        query = text("CALL update_season(:season_id, :season_name, :season_start, :season_end)")
        params = {"season_id": season_id, **season_data.model_dump()}
        self.db.execute(query, params)
        self.db.commit()



    def delete_season(self, season_id: int):
        query = text("CALL delete_season(:season_id)")
        self.db.execute(query, {"season_id": season_id})
        self.db.commit()


    def create_season(self, season_data: CreateSeason):
        query = text("CALL create_season(:season_name, :season_start, :season_end)")
        params = season_data.model_dump()
        self.db.execute(query, params)
        self.db.commit()


    def get_players_statistic(self, season_id: int = None, week_ids: list[int] = None):
        query = text("""
            SELECT * 
            FROM get_players_statistic(:p_season_id, :p_week_ids);
        """)
        result = self.db.execute(query, {"p_season_id": season_id, "p_week_ids": week_ids})
        return [PlayerStatistic(**row) for row in result.mappings()]

    def get_players_season_progress(self, first_season_id: int = None, second_season_id: int = None):
        query = text("""
            SELECT * 
            FROM get_players_season_progress(:p_first_season_id, :p_second_season_id);
        """)
        result = self.db.execute(query, {"p_first_season_id": first_season_id, "p_second_season_id": second_season_id})
        return [PlayerSeasonProgress(**row) for row in result.mappings()]


    def get_teams_season_progress(self, first_season_id: int = None, second_season_id: int = None):
        query = text("""
            SELECT * 
            FROM get_teams_season_progress(:p_first_season_id, :p_second_season_id);
        """)
        result = self.db.execute(query, {"p_first_season_id": first_season_id, "p_second_season_id": second_season_id})
        return [TeamSeasonProgress(**row) for row in result.mappings()]

    def get_season_playground_views(self, season_id: int = None, week_ids: list[int] = None):
        query = text("""
            SELECT * 
            FROM get_playground_views(:p_season_id, :p_week_ids);
        """)
        result = self.db.execute(query, {"p_season_id": season_id, "p_week_ids": week_ids})
        return [SeasonPlaygroundViews(**row) for row in result.mappings()]

    def get_teams_statistic(self, season_id: int = None, week_ids: list[int] = None):
        query = text("""
            SELECT * 
            FROM get_teams_statistic(:p_season_id, :p_week_ids);
        """)
        result = self.db.execute(query, {"p_season_id": season_id, "p_week_ids": week_ids})
        return [TeamStatistic(**row) for row in result.mappings()]

    def get_season_players_best_game(self, season_id: int = None):
        query = text("""
            SELECT * 
            FROM get_season_players_best_game(:p_season_id);
        """)
        result = self.db.execute(query, {"p_season_id": season_id})
        return [SeasonPlayerBestGame(**row) for row in result.mappings()]