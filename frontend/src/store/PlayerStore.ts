import PlayerService from "../service/PlayerService";
import { IPlayerTeamView } from "@/models/views/IPlayerTeamView";
import { makeAutoObservable, toJS } from "mobx";
import { runWithLoader } from "../utilits/runWithLoader";
import { IPlayerCreator } from "../models/creators/IPlayerCreator";

export default class PlayerStore{
      playerTeamView: IPlayerTeamView[] = [];
      loading = false;

      constructor() {
            makeAutoObservable(this)
      }

      setLoading = (value: boolean) => {
            this.loading = value;
      } 

      async createPlayer(playerData: IPlayerCreator) {
            await runWithLoader(() => PlayerService.createPlayer(playerData), this.setLoading );
      }

      async fetchPlayerTeamView() {
            const result = await runWithLoader(() => PlayerService.fetchPlayerTeamView(), this.setLoading );
            if (result) this.playerTeamView = result;
      }

      async updatePlayerTeam(playerTeamData: IPlayerTeamView) {
            await runWithLoader(() => PlayerService.updatePlayerTeam(playerTeamData), this.setLoading );
      }

      async deletePlayer(player_id: number) {
            await runWithLoader(() => PlayerService.deletePlayer(player_id), this.setLoading );
      }
}