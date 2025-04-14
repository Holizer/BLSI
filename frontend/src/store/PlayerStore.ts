import PlayerService from "../service/PlayerService";
import { IPlayerTeamView } from "@/models/player/IPlayerTeamView";
import { makeAutoObservable, toJS } from "mobx";
import { runWithLoader } from "../utilits/runWithLoader";
import { IPlayerCreator } from "../models/creators/IPlayerCreator";
import { IPlayerStatistic } from "@/models/player/IPlayerStatistic";

export default class PlayerStore{
      playerTeams: IPlayerTeamView[] = [];
      playerStatistics: IPlayerStatistic[] = [];
      loading = false;

      constructor() {
            makeAutoObservable(this)
            this.fetchPlayerTeamView();
      }

      setLoading = (value: boolean) => {
            this.loading = value;
      } 

      async createPlayer(playerData: IPlayerCreator) {
            await runWithLoader(() => PlayerService.createPlayer(playerData), this.setLoading );
      }

      getPlayersTeam(team_id: number) {
            const teamPlayersList = this.playerTeams.filter(player => player.team_id == team_id);
            return teamPlayersList;
      }

      async fetchPlayerTeamView() {
            const result = await runWithLoader(() => PlayerService.fetchPlayerTeamView(), this.setLoading );
            if (result) this.playerTeams = result;
      }

      async fetchPlayerStatistics(seasonId?: number, weekIds?: number[]) {
            const result = await runWithLoader(() => PlayerService.fetchPlayerStatistics(seasonId, weekIds), this.setLoading );
            if (result) this.playerStatistics = result;
      }
        
      async updatePlayerTeam(playerTeamData: IPlayerTeamView) {
            await runWithLoader(() => PlayerService.updatePlayerTeam(playerTeamData), this.setLoading );
      }

      async deletePlayer(player_id: number) {
            await runWithLoader(() => PlayerService.deletePlayer(player_id), this.setLoading );
      }
}