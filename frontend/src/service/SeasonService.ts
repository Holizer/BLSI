import $api from "../http";
import { ITeamStatistic } from "@/models/team/ITeamStatistic";
import { ISeasonWithWeeks } from "@/models/season/ISeasonWithWeeks";
import { IPlayerStatistic } from "@/models/player/IPlayerStatistic";
import { ISeasonPlayerBestGame } from "@/models/player/ISeasonPlayerBestGame";
import { ISeasonPlaygroundViews } from "@/models/playground/ISeasonPlaygroundViews";
import { IPlayerSeasonProgress } from "@/models/player/IPlayerSeasonProgress";
import { ITeamSeasonProgress } from "@/models/team/ITeamSeasonProgress";
import { toast } from "sonner";
import { ISeasonCreator } from "@/models/creators/ISeasonCreator";

export default class SeasonService {
     static async fetchSeasonWithWeeks(): Promise<ISeasonWithWeeks[]> {
          try {
               const response = await $api.get<ISeasonWithWeeks[]>('/seasons/');
               return response.data; 
          } catch (error) {
               console.error("Произошла ошибка:", error);
               throw error;
          }
     }

     static async fetchPlayersStatistic(seasonId?: number, weekIds?: number) : Promise<IPlayerStatistic[]> {
          try {
               const response = await $api.get<IPlayerStatistic[]>('/seasons/get-players-statistic', {
                    params: { season_id: seasonId, week_ids: weekIds }
               });
               return response.data;
          } catch (error) {
               console.error("Неудалось получить статистику игроков:", error);
               throw error;
          }
     }


     static async createSeason(season_data: ISeasonCreator): Promise<ISeasonWithWeeks> {
          try {
               const response = await $api.post<ISeasonWithWeeks>('/seasons/', season_data);
               toast.success(`Сезон ${season_data.season_name} успешно создана!`)
               return response.data; 
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    toast.error(error.response.data.detail);
               } else {
                    console.error('Произошла ошибка при создании площадки:', error.message);
               }
               throw error;
          }
     }
     
     static async updateSeason(seasonData: ISeasonWithWeeks): Promise<ISeasonWithWeeks> {
          try {
              const response = await $api.put<ISeasonWithWeeks>(`/seasons/${seasonData.season_id}`, seasonData);
              return response.data;
          } catch (error: any) {
              if (error.response?.data?.detail) {
                  toast.error(error.response.data.detail);
              } else {
                  console.error('Произошла ошибка при обновлении сезона:', error.message);
                  toast.error('Произошла ошибка при обновлении сезона');
              }
              throw error;
          }
     }

     static async deleteSeason(season_id: number): Promise<void> {
          try {
               await $api.delete(`/seasons/${season_id}`);
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    toast.error(error.response.data.detail);
               } else {
                    console.error('Произошла ошибка при удалении сезона:', error.message);
               }
               throw error;
          }
     }

     //#region STATISTIC
     static async fetchPlaygroundViews(seasonId?: number, weekIds?: number) : Promise<ISeasonPlaygroundViews[]> {
          try {
               const response = await $api.get<ISeasonPlaygroundViews[]>('/seasons/get-season-playground-views', {
                    params: { season_id: seasonId, week_ids: weekIds }
               });
               return response.data;
          } catch (error) {
               console.error("Неудалось получить статистику игровых площадок:", error);
               throw error;
          }
     }

     static async fetchTeamsStatistic(seasonId?: number, weekIds?: number): Promise<ITeamStatistic[]> {
          try {
               const response = await $api.get<ITeamStatistic[]>('/seasons/get-teams-statistic', {
                    params: { season_id: seasonId, week_ids: weekIds }
               });
               return response.data;
          } catch (error) {
               console.error("Неудалось получить статистику команд:", error);
               throw error;
          }
     }
     
     static async fetchPlayersBestGame(seasonId?: number): Promise<ISeasonPlayerBestGame[]> {
          try {
               const response = await $api.get<ISeasonPlayerBestGame[]>('/seasons/get-season-players-best-game', {
                    params: { season_id: seasonId }
               });
               return response.data;
          } catch (error) {
               console.error("Неудалось получить статистику игроков:", error);
               throw error;
          }
     }

     static async fetchPlayersSeasonPrоgess(first_season_id: number, second_season_id: number): Promise<IPlayerSeasonProgress[]> {
          try {
               const response = await $api.get<IPlayerSeasonProgress[]>('/seasons/get-players-season-progress', {
                    params: { first_season_id: first_season_id, second_season_id: second_season_id }
               });
               return response.data;
          } catch (error) {
               console.error("Неудалось получить прогресс игроков за выбранные сезоны:", error);
               throw error;
          }
     }

     static async fetchTeamsSeasonPrоgess(first_season_id: number, second_season_id: number): Promise<ITeamSeasonProgress[]> {
          try {
               const response = await $api.get<ITeamSeasonProgress[]>('/seasons/get-teams-season-progress', {
                    params: { first_season_id: first_season_id, second_season_id: second_season_id }
               });
               return response.data;
          } catch (error) {
               console.error("Неудалось получить прогресс игроков за выбранные сезоны:", error);
               throw error;
          }
     }
     //#endregion
}