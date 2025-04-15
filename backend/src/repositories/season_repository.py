from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from collections import defaultdict
from src.schemas.season import (
    SeasonWithWeeks,
    TeamStatistic,
    PlayerStatistic,
    SeasonPlaygroundViews,
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
    
    def get_players_statistic(self, season_id: int = None, week_ids: list[int] = None):
        query = text("""
            SELECT * 
            FROM get_players_statistic(:p_season_id, :p_week_ids);
        """)
        result = self.db.execute(query, {"p_season_id": season_id, "p_week_ids": week_ids})
        return [PlayerStatistic(**row) for row in result.mappings()]


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