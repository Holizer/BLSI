import PlayerService from "../service/PlayerService";
import { IPlayerTeamView } from "@/models/views/IPlayerTeamView";
import { makeAutoObservable } from "mobx";

export default class PlayerStore{
      playerTeamView: IPlayerTeamView[] = [];
      loading = false;

      constructor() {
            makeAutoObservable(this)
      }

      setLoading = (value: boolean) => {
            this.loading = value;
      } 

      async fetchPlayerTeamView() {
            this.setLoading(true)
            try {
                  this.playerTeamView = await PlayerService.fetchPlayerTeamView();
            } catch (error) {
                  console.error("Ошибка загрузки игроков:", error);
            } finally {
                  this.setLoading(false)
            }
      }

      async updatePlayerTeam(playerTeamData: IPlayerTeamView) {
            this.setLoading(true)
            try {
                  await PlayerService.updatePlayerTeam(playerTeamData);
            } catch (error) {
                  console.error("Ошибка загрузки игроков:", error);
            } finally {
                  this.setLoading(false)
            }
      }

      async deletePlayer(player_id: number) {
            this.setLoading(true)
            try {
                  await PlayerService.deletePlayer(player_id);
            } catch (error) {
                  console.error("Ошибка загрузки игроков:", error);
            } finally {
                  this.setLoading(false)
            }
      }
}