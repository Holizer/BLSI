export interface IPlayerSeasonProgress {
    player_id: number
    player_name: string
    team_name: string
    first_season_id: number
    first_season_name: string
    second_season_id: number
    second_season_name: string
    first_season_avg_points: number
    second_season_avg_points: number
    points_diff: number
    improvement_percentage?: number
    first_season_handicap: number
    second_season_handicap: number
    handicap_diff: number
}