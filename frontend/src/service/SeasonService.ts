import { ITeamSeasonStats } from "@/models/team/ITeamSeasonStats";
import $api from "../http";
import { ISeasonWithWeeks } from "@/models/season/ISeasonWithWeeks";

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

     static async fetchAllTeamsSeasonStats(): Promise<ITeamSeasonStats[]> {
          try {
               const response = await $api.get<ITeamSeasonStats[]>('/seasons/teams-season-stats');
               return response.data; 
          } catch (error) {
               console.error("Произошла ошибка:", error);
               throw error;
          }
     }
}