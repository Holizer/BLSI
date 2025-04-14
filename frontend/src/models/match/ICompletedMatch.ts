export interface ICompletedMatch {
    match_id: number;
    season_id: number;
    season_name: string;
    week_id: number;
    week_start: string;  
    week_end: string;
    team1_id: number;
    team1_name: string;
    team1_points: number;
    team2_id: number;
    team2_name: string;
    team2_points: number;
    event_date: string; 
    event_time: string;
    playground_id: number;
    playground_name: string;
    winner: string;
    match_status_id: number;
    match_status_type_id: number;
    status?: string;
}