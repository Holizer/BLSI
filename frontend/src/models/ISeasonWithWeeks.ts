import { IWeek } from "./IWeek";

export interface ISeasonWithWeeks {
    season_id: number;
    season_name: string;
    season_start: string; 
    season_end: string; 
    weeks: IWeek[];
}