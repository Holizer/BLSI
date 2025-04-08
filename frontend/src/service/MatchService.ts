import $api from "../http";
import { IScheduledMatch } from "../models/views/IScheduledMatch";
import { IMatchStatusType } from "../models/IMatchStatusType";

export default class MatchesService {
     static async fetchSheduledMacthes(): Promise<IScheduledMatch[]> {
          try {
               const response = await $api.get<IScheduledMatch[]>('/matches/scheduled/');
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить причин отмены матчей:", error);
               throw error;
          }
     }

     static async fetchMatchStatusTypes(): Promise<IMatchStatusType[]> {
          try {
     
               const response = await $api.get<IMatchStatusType[]>('/matches/status-types/');
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить причин отмены матчей:", error);
               throw error;
          }
     }
}