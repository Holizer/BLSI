import $api from "../http";
import { IScheduledMatch } from "../models/views/IScheduledMatch";
import { IMatchStatusType } from "../models/IMatchStatusType";
import { ICanceledMatch } from "../models/views/ICanceledMatch";
import { IForfeitedMatch } from "../models/views/IForfeitedMatch";

export default class MatchesService {
     static async fetchMatchStatusTypes(): Promise<IMatchStatusType[]> {
          try {
     
               const response = await $api.get<IMatchStatusType[]>('/matches/status-types/');
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить причин отмены матчей:", error);
               throw error;
          }
     }

     static async fetchSheduledMacthes(): Promise<IScheduledMatch[]> {
          try {
               const response = await $api.get<IScheduledMatch[]>('/matches/scheduled/');
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить причин отмены матчей:", error);
               throw error;
          }
     }

     static async fetchCanceledMacthes(): Promise<ICanceledMatch[]> {
          try {
     
               const response = await $api.get<ICanceledMatch[]>('/matches/canceled/');
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить причин отмены матчей:", error);
               throw error;
          }
     }

     static async fetchForfeitedMacthes(): Promise<IForfeitedMatch[]> {
          try {
     
               const response = await $api.get<IForfeitedMatch[]>('/matches/forfeited/');
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить матчи с неявками:", error);
               throw error;
          }
     }
}