import { ICoachTeam } from "@/models/ICoach";
import $api from "../http";
import { toast } from "sonner";

export default class CoachService {
     static async fetchCoaches(): Promise<ICoachTeam[]> {
          try {
               const response = await $api.get<ICoachTeam[]>('/coaches/get-coaches');
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить список тренеров:", error);
               throw error;
          }
     }

     static async createCoach(coachData: Partial<ICoachTeam>): Promise<ICoachTeam> {
          try {
               const response = await $api.post<ICoachTeam>('/coaches/create-coach', coachData);
               toast.success(`Тренер "${coachData.first_name} ${coachData.last_name}" успешно добавлен!`)
               return response.data; 
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    toast.error(error.response.data.detail);
               } else {
                    console.error('Произошла ошибка при создании тренера:', error.message);
               }
               throw error;
          }
     }

     static async deleteCoach(coach_id: number): Promise<void> {
          try {
               await $api.delete(`/coaches/delete-coach/${coach_id}`);
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    toast.error(error.response.data.detail);
               } else {
                    console.error('Произошла ошибка при удалении тренера:', error.message);
               }
               throw error;
          }
     }

     static async updateCoach(coachData: ICoachTeam): Promise<ICoachTeam> {
          try {
               const response = await $api.put<ICoachTeam>(`/coaches/update-coach`, coachData);
               return response.data; 
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    toast.error(error.response.data.detail);
               } else {
                    console.error('Произошла ошибка при обновлении названия команды:', error.message);
               }
               throw error;
          }
     }
}