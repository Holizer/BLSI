import $api from "../http";
import { IScheduledMatch } from "../models/views/IScheduledMatch";
import { IMatchStatusType } from "../models/IMatchStatusType";
import { ICanceledMatch } from "../models/views/ICanceledMatch";
import { IForfeitedMatch } from "../models/views/IForfeitedMatch";
import { ICompletedMatch } from "@/models/views/ICompletedMatch";
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

     static async fetchSheduledMactches(): Promise<IScheduledMatch[]> {
          try {
               const response = await $api.get<IScheduledMatch[]>('/matches/scheduled/');
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить причин отмены матчей:", error);
               throw error;
          }
     }

     static async fetchCanceledMactches(): Promise<ICanceledMatch[]> {
          try {
     
               const response = await $api.get<ICanceledMatch[]>('/matches/canceled/');
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить причин отмены матчей:", error);
               throw error;
          }
     }

     static async fetchCompletedMatches(): Promise<ICompletedMatch[]> {
          try {
     
               const response = await $api.get<ICompletedMatch[]>('/matches/completed/');
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить матчи с неявками:", error);
               throw error;
          }
     }

     static async fetchForfeitedMactches(): Promise<IForfeitedMatch[]> {
          try {
     
               const response = await $api.get<IForfeitedMatch[]>('/matches/forfeited/');
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