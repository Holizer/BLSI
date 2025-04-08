export interface IScheduledMatch {
      match_id: number;
      season_name: string;
      week_start: string;
      week_end: string;
      team1: string;
      team2: string;
      event_date: string;
      event_time: string;
      playground_name: string;
      status?: string;
}