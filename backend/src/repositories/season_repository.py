from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from collections import defaultdict
from src.schemas.season import (
    SeasonWithWeeks,
    TeamSeasonStats
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
            # Add the week to the corresponding season
            seasons_data[season_id]['season_id'] = row['season_id']
            seasons_data[season_id]['season_name'] = row['season_name']
            seasons_data[season_id]['season_start'] = row['season_start']
            seasons_data[season_id]['season_end'] = row['season_end']
            seasons_data[season_id]['weeks'].append(week_data)
        
        return [
            SeasonWithWeeks(**season) 
            for season in seasons_data.values()
        ]
    
    def get_team_season_stats(self, team_id: int) -> list[TeamSeasonStats]:
        query = text("""
            SELECT * FROM team_season_stats
            WHERE team_id = :team_id
            ORDER BY season_id
        """)
        result = self.db.execute(query, {"team_id": team_id})
        
        return [
            TeamSeasonStats(**row._asdict())
            for row in result
        ]
    
    def get_all_teams_season_stats(self, season_id: int = None, week_id: int = None) -> list[TeamSeasonStats]:
        base_query = "SELECT * FROM team_season_stats"
        conditions = []
        params = {}
        
        if season_id:
            conditions.append("season_id = :season_id")
            params["season_id"] = season_id
        
        if week_id:
            conditions.append("week_id = :week_id")
            params["week_id"] = week_id
        
        if conditions:
            base_query += " WHERE " + " AND ".join(conditions)
        
        base_query += " ORDER BY season_id, season_rank"
        
        query = text(base_query)
        result = self.db.execute(query, params)
        
        return [
            TeamSeasonStats(**row._asdict())
            for row in result
        ]