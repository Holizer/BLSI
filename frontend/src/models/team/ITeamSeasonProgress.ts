export interface ITeamSeasonProgress {
    team_id: number
    team_name: string

    first_season_id: number
    first_season_name: string
    second_season_id: number
    second_season_name: string

    first_season_wins: number
    second_season_wins: number
    wins_diff: number

    first_season_losses: number
    second_season_losses: number
    losses_diff: number

    first_season_draws: number
    second_season_draws: number
    draws_diff: number

    first_season_total_points: number
    second_season_total_points: number
    points_diff: number
    improvement_percentage?: number

    first_season_avg_points: number
    second_season_avg_points: number
    avg_points_diff: number
}