import { IPlayerStat } from "../player/IPlayerStat";

export interface IMatchCreator {
      status_type_id: number;
      week_id: number;
      playground_id: number;
      team1_id: number;
      team2_id: number;
      event_date: string;
      event_time: string;
      cancellation_reason_id?: number | null;
      forfeiting_team_id?: number | null;
      team1_points?: number | null; 
      team2_points?: number | null; 
      views_count?: number | null;
      match_duration?: string | null;
      player_stats: IPlayerStat[]; 
}