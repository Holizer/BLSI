import { makeAutoObservable } from "mobx";
import { runWithLoader } from "../utilits/runWithLoader";
import { ISeasonWithWeeks } from "@/models/season/ISeasonWithWeeks";
import SeasonService from "../service/SeasonService";
import { ITeamStatistic } from "@/models/team/ITeamStatistic";
import { IPlayerStatistic } from "@/models/player/IPlayerStatistic";
import { ISeasonPlayerBestGame } from "@/models/player/ISeasonPlayerBestGame";
import { ISeasonPlaygroundViews } from "@/models/playground/ISeasonPlaygroundViews";

export default class SeasonStore {
      loading = false;
      seasonWithWeeks: ISeasonWithWeeks[] = []; 
      selectedSeasonId?: number;
      selectedWeekId?: number ;

      teamsStatistics: ITeamStatistic[] = []; 
      playersStatistic: IPlayerStatistic[] = [];
      playersBestGame: ISeasonPlayerBestGame[] = [];
      playgroundViews: ISeasonPlaygroundViews[] = []; 
  
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
                  if (result.length > 0) {
                        this.selectedSeasonId = result[0].season_id;
                        const lastWeek = result[0].weeks[result[0].weeks.length - 1];
                        this.selectedWeekId = lastWeek?.week_id;
                  }
            }
      }

      async fetchPlayersStatistic(seasonId?: number, weekIds?: number) {
            const result = await runWithLoader(() => SeasonService.fetchPlayersStatistic(seasonId, weekIds), this.setLoading );
            if (result) this.playersStatistic = result;
      }

      async fetchTeamsStatistic(seasonId?: number, weekIds?: number) {
            const result = await runWithLoader(() => SeasonService.fetchTeamsStatistic(seasonId, weekIds), this.setLoading );
            if (result) this.teamsStatistics = result;
      }

      async fetchPlayersBestGame(seasonId?: number) {
            const result = await runWithLoader(() => SeasonService.fetchPlayersBestGame(seasonId), this.setLoading );
            if (result) this.playersBestGame = result;
      }

      async fetchPlaygroundViews(seasonId?: number, weekIds?: number) {
            const result = await runWithLoader(() => SeasonService.fetchPlaygroundViews(seasonId, weekIds), this.setLoading );
            if (result) this.playgroundViews = result;
      }

      get seasons() {
            return this.seasonWithWeeks;
      }
    
      setSelectedSeason = (seasonId: number) => {
            this.selectedSeasonId = seasonId;
            const selectedSeason = this.seasonWithWeeks.find(season => season.season_id === seasonId);
            if (selectedSeason && selectedSeason.weeks.length > 0)
                this.selectedWeekId = selectedSeason.weeks[0].week_id;
      };
    
      setSelectedWeek = (weekId?: number) => {
            this.selectedWeekId = weekId;
        };
    
      get activeSeason() {
            if (this.selectedSeasonId) {
                return this.seasonWithWeeks.find(season => season.season_id === this.selectedSeasonId);
            }
            return this.seasonWithWeeks[0];
      }
    
      get selectedWeek() {
            if (!this.selectedWeekId || !this.activeSeason) return null;
            return this.activeSeason.weeks.find(week => week.week_id === this.selectedWeekId);
      }

      getAllWeeksIdsInLastSeason() {
            return this.activeSeason?.weeks.map(week => week.week_id); 
      }

      getAllWeeksInSeason(season: ISeasonWithWeeks) {
            return season.weeks.map(week => week.week_id); 
      }
    
      getLastWeekInSeason(season: ISeasonWithWeeks) {
            return season.weeks[season.weeks.length - 1];
      }
}