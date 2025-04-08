import $api from "../http";
// import { toast } from "sonner";
import { ISeasonWithWeeks } from "@/models/ISeasonWithWeeks";

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
}