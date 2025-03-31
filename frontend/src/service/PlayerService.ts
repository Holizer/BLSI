import { IPlayer } from "@/models/IPlayer";
import $api from "../http";
import { IPlayerTeamView } from "../views/IPlayerTeamView";

export default class PlayerService {
     static async fetchPlayerTeamView(): Promise<IPlayerTeamView[]> {
          try {
               const response = await $api.get<IPlayerTeamView[]>('/players/player_team');
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить список игроков и их команд:", error);
               throw error;
          }
     }
     
     // static async fetchPlayersList(): Promise<IPlayer[]> {
     //      const response = await $api.get<IPlayer[]>('/players/players-list');
     //      return response.data; 
     // }

     static async updatePlayerTeam(playerTeamData: IPlayerTeamView): Promise<IPlayerTeamView> {
          try {
               const response = await $api.put<IPlayerTeamView>(`/players/update_player_team/${playerTeamData.player_id}`, playerTeamData);
               return response.data; 
          } catch (error) {
               console.error("Неудалось обновить данные игрока:", error);
               throw error;
          }
     }
}