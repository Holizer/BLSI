import $api from "../http";
import { ITeamStatistic } from "@/models/team/ITeamStatistic";
import { ISeasonWithWeeks } from "@/models/season/ISeasonWithWeeks";
import { IPlayerStatistic } from "@/models/player/IPlayerStatistic";
import { ISeasonPlayerBestGame } from "@/models/player/ISeasonPlayerBestGame";
import { ISeasonPlaygroundViews } from "@/models/playground/ISeasonPlaygroundViews";

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
     
     static async fetchPlaygroundViews(seasonId?: number, weekIds?: number) : Promise<ISeasonPlaygroundViews[]> {
          try {
               const response = await $api.get<ISeasonPlaygroundViews[]>('/seasons/get-season-playground-views', {
                    params: { season_id: seasonId, week_ids: weekIds }
               });
               return response.data;
          } catch (error) {
               console.error("Неудалось получить статистику игроков:", error);
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
}