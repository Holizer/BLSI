import { makeAutoObservable } from "mobx";
import { runWithLoader } from "../utilits/runWithLoader";
import { ISeasonWithWeeks } from "@/models/season/ISeasonWithWeeks";
import SeasonService from "../service/SeasonService";
import { ITeamSeasonStats } from "@/models/team/ITeamSeasonStats";

export default class SeasonStore {
      loading = false;
      seasonWithWeeks: ISeasonWithWeeks[] = []; 
      teamSeasonStats: ITeamSeasonStats[] = []; 

      constructor() {
            makeAutoObservable(this);
            this.fetchSeasonWithWeeks();
      }

      setLoading = (value: boolean) => {
            this.loading = value;
      };

      async fetchSeasonWithWeeks() {
            const result = await runWithLoader(() => SeasonService.fetchSeasonWithWeeks(), this.setLoading);
            if (result) {
                  this.seasonWithWeeks = result;
            }
      }

      async fetchAllTeamsSeasonStats() {
            const result = await runWithLoader(() => SeasonService.fetchAllTeamsSeasonStats(), this.setLoading);
            if (result) {
                  this.teamSeasonStats = result;
            }
      }

      get seasons() {
            return this.seasonWithWeeks;
      }
    
      get activeSeason() {
            return this.seasonWithWeeks[0]; 
      }
    
      
      getAllWeeksIdsInLastSeason() {
            return this.activeSeason.weeks.map(week => week.week_id); 
      }

      getAllWeeksInSeason(season: ISeasonWithWeeks) {
            return season.weeks.map(week => week.week_id); 
      }
    
      getLastWeekInSeason(season: ISeasonWithWeeks) {
            return season.weeks[season.weeks.length - 1];
      }
}