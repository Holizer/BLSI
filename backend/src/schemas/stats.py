from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

class TeamStatistic(BaseModel):
    rank: int
    team_id: int
    team_name: str
    wins: int
    losses: int
    draws: int
    total_points: int
    win_percentage: float
    season_id: int
    season_name: str
    week_id: int
    week_start_date: date
    week_end_date: date

class PlayerStatistic(BaseModel):
    player_id: int
    player_name: str
    total_points: int
    average_points: int
    total_games: int
    handicap: float
    week_id: int
    season_id: int
    season_name: str
    week_start_date: date
    week_end_date: date

class SeasonPlayerBestGame(BaseModel):
    player_id: int
    player_name: str
    max_scored_points: int
    match_id: int
    season_id: int
    season_name: str
    week_id: int
    week_start_date: date
    week_end_date: date

class SeasonPlaygroundViews(BaseModel):
    playground_id: int
    playground_name: str
    week_id: int
    week_start_date: date
    week_end_date: date
    total_views: Optional[int]

class PlayerSeasonProgress(BaseModel):
    player_id: int
    player_name: str
    team_name: str
    first_season_id: int
    first_season_name: str
    second_season_id: int
    second_season_name: str
    first_season_avg_points: float
    second_season_avg_points: float
    points_diff: float
    improvement_percentage: Optional[float] = None
    first_season_handicap: float
    second_season_handicap: float
    handicap_diff: float

class TeamSeasonProgress(BaseModel):
    team_id: int
    team_name: str

    first_season_id: int
    first_season_name: str
    second_season_id: int
    second_season_name: str

    first_season_wins: int
    second_season_wins: int
    wins_diff: int

    first_season_losses: int
    second_season_losses: int
    losses_diff: int

    first_season_draws: int
    second_season_draws: int
    draws_diff: int

    first_season_total_points: float
    second_season_total_points: float
    points_diff: float
    improvement_percentage: Optional[float] = None

    first_season_avg_points: float
    second_season_avg_points: float
    avg_points_diff: float