import $api from "../http";
import { toast } from "sonner";
import { IPlayerTeamView } from "../views/IPlayerTeamView";

export default class PlayerService {
     static async fetchPlayerTeamView(): Promise<IPlayerTeamView[]> {
          try {
               const response = await $api.get<IPlayerTeamView[]>('/players/get-player-team');
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить список игроков и их команд:", error);
               throw error;
          }
     }

     static async updatePlayerTeam(playerTeamData: IPlayerTeamView): Promise<IPlayerTeamView> {
          try {
               const response = await $api.put<IPlayerTeamView>(`/players/update-player-team/${playerTeamData.player_id}`, playerTeamData);
               return response.data; 
          } catch (error: any) {
               toast.error(error.response.data.detail);
               throw error;
          }
     }

     static async deletePlayer(player_id: number): Promise<void> {
          try {
               await $api.delete(`/players/delete/${player_id}`);
          } catch (error: any) {
               toast.error(error.response.data.detail);
               throw error;
          }
     }
}