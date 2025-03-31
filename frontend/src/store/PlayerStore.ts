import PlayerService from "../service/PlayerService";
import { IPlayerTeamView } from "@/views/IPlayerTeamView";
import { makeAutoObservable } from "mobx";


export default class PlayerStore {
      playerTeamView: IPlayerTeamView[] = [];
      loading = false;

      constructor() {
            makeAutoObservable(this);
      }

      async fetchPlayerTeamView() {
            this.loading = true;
            try {
                  this.playerTeamView = await PlayerService.fetchPlayerTeamView();
            } catch (error) {
                  console.error("Ошибка загрузки игроков:", error);
            } finally {
                  this.loading = false;
            }
      }

      async updatePlayerTeam(playerTeamData: IPlayerTeamView) {
            this.loading = true;
            try {
                  await PlayerService.updatePlayerTeam(playerTeamData);
            } catch (error) {
                  console.error("Ошибка загрузки игроков:", error);
            } finally {
                  this.loading = false;
            }
      }
}