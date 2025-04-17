import { makeAutoObservable } from "mobx";
import { runWithLoader } from "../utilits/runWithLoader";
import { ISeasonWithWeeks } from "@/models/season/ISeasonWithWeeks";
import SeasonService from "../service/SeasonService";
import { ITeamStatistic } from "@/models/team/ITeamStatistic";
import { IPlayerStatistic } from "@/models/player/IPlayerStatistic";
import { ISeasonPlayerBestGame } from "@/models/player/ISeasonPlayerBestGame";
import { ISeasonPlaygroundViews } from "@/models/playground/ISeasonPlaygroundViews";
import { IPlayerSeasonProgress } from "@/models/player/IPlayerSeasonProgress";
import { ITeamSeasonProgress } from "@/models/team/ITeamSeasonProgress";
import { ISeasonCreator } from "@/models/creators/ISeasonCreator";

export default class SeasonStore {
      loading = false;
      seasonWithWeeks: ISeasonWithWeeks[] = []; 
      selectedSeasonId?: number;
      selectedWeekId?: number ;

      teamsStatistics: ITeamStatistic[] = []; 
      playersStatistic: IPlayerStatistic[] = [];
      playersBestGame: ISeasonPlayerBestGame[] = [];
      playgroundViews: ISeasonPlaygroundViews[] = []; 
      playersSeasonProgress: IPlayerSeasonProgress[] = []; 
      teamsSeasonProgress: ITeamSeasonProgress[] = []; 
  
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

      async updateSeason(seasonData: ISeasonWithWeeks) {
            await runWithLoader(() => SeasonService.updateSeason(seasonData), this.setLoading);
      }

      async deleteSeason(season_id: number) {
            await runWithLoader(() => SeasonService.deleteSeason(season_id), this.setLoading);
      }

      async createSeason(season_data: ISeasonCreator) {
            await runWithLoader(() => SeasonService.createSeason(season_data), this.setLoading);
      }

      //#region STATISTIC
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

      async fetchPlayersSeasonPrоgess(first_season_id: number, second_season_id: number) {
            const result = await runWithLoader(() => SeasonService.fetchPlayersSeasonPrоgess(first_season_id, second_season_id), this.setLoading );
            if (result) this.playersSeasonProgress = result;
      }

      async fetchTeamsSeasonPrоgess(first_season_id: number, second_season_id: number) {
            const result = await runWithLoader(() => SeasonService.fetchTeamsSeasonPrоgess(first_season_id, second_season_id), this.setLoading );
            if (result) this.teamsSeasonProgress = result;
      }
      //#endregion
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
}