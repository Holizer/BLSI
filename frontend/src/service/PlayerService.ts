import $api from "../http";
import { toast } from "sonner";
import { IPlayerTeamView } from "../models/player/IPlayerTeamView";
import { IPlayerCreator } from "@/models/creators/IPlayerCreator";
import { IPlayerStatistic } from "@/models/player/IPlayerStatistic";

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
     
     static async fetchPlayerStatistics(seasonId: number, weekIds: number[]): Promise<IPlayerStatistic[]> {
          try {
              const response = await $api.get<IPlayerStatistic[]>('/players/get-player-statistics', {
                  params: { season_id: seasonId, week_ids: weekIds }
              });
              return response.data;
          } catch (error) {
              console.error("Неудалось получить статистику игроков:", error);
              throw error;
          }
     }

     static async createPlayer(playerData: IPlayerCreator) {
          try {
               const response = await $api.post('/players/create-player', playerData);
               toast.success(`Игрок ${playerData.first_name} ${playerData.last_name} создан успешно!`)
               return response.data; 
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    toast.error(error.response.data.detail);
               } else {
                    console.error('Произошла ошибка при создании игрока:', error.message);
               }
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