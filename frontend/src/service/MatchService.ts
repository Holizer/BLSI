import $api from "../http";
import { IScheduledMatch } from "../models/match/IScheduledMatch";
import { IMatchStatusType } from "../models/matchStatus/IMatchStatusType";
import { ICanceledMatch } from "../models/match/ICanceledMatch";
import { IForfeitedMatch } from "../models/match/IForfeitedMatch";
import { ICompletedMatch } from "@/models/match/ICompletedMatch";
import { IMatchCreator } from "@/models/creators/IMatchCreator";

export default class MatchService {
     static async fetchMatchStatusTypes(): Promise<IMatchStatusType[]> {
          try {
               const response = await $api.get<IMatchStatusType[]>('/matches/status-types/');
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить причин отмены матчей:", error);
               throw error;
          }
     }

     static async fetchSheduledMactches(seasonId?: number, weekIds?: number): Promise<IScheduledMatch[]> {
          try {
               const response = await $api.get<IScheduledMatch[]>('/matches/scheduled/', {
                    params: { season_id: seasonId, week_ids: weekIds }
               });
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить причин отмены матчей:", error);
               throw error;
          }
     }

     static async fetchCanceledMactches(seasonId?: number, weekIds?: number): Promise<ICanceledMatch[]> {
          try {
               const response = await $api.get<ICanceledMatch[]>('/matches/canceled/', {
                    params: { season_id: seasonId, week_ids: weekIds }
               });
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить причин отмены матчей:", error);
               throw error;
          }
     }

     static async fetchCompletedMatches(seasonId?: number, weekIds?: number): Promise<ICompletedMatch[]> {
          try {
     
               const response = await $api.get<ICompletedMatch[]>('/matches/completed/', {
                    params: { season_id: seasonId, week_ids: weekIds }
               });
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить матчи с неявками:", error);
               throw error;
          }
     }

     static async fetchForfeitedMactches(seasonId?: number, weekIds?: number): Promise<IForfeitedMatch[]> {
          try {
     
               const response = await $api.get<IForfeitedMatch[]>('/matches/forfeited/', {
                    params: { season_id: seasonId, week_ids: weekIds }
               });
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить матчи с неявками:", error);
               throw error;
          }
     }

     static async createMatch(matchData: IMatchCreator) {
          try {
              const response = await $api.post('/matches/', matchData);
              return response.data;
          } catch (error) {
              console.error("Не удалось создать матч:", error);
              throw error;
          }
     }
}