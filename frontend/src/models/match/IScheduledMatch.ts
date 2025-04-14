export interface IScheduledMatch {
    match_id: number;
    season_id: number;
    season_name: string;
    week_id: number;
    week_start: string;  
    week_end: string;
    team1_id: number;
    team1_name: string;
    team2_id: number;
    team2_name: string;
    event_date: string; 
    event_time: string;
    playground_id: number;
    playground_name: string;
    match_status_id: number;
    match_status_type_id: number;
    status?: string;
}