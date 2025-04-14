import { ITeam } from "@/models/team/ITeam";
import $api from "../http";
import { toast } from "sonner";
import { ITeamCoachCaptainView } from "../models/teamCoachCapitan/ITeamCoachCaptainView";

export default class TeamService {
     static async fetchTeamsList(): Promise<ITeam[]> {
          const response = await $api.get<ITeam[]>('/teams/teams-list');
          return response.data; 
     }

     static async fetchTeamsWithCaptainAndCoach(): Promise<ITeamCoachCaptainView[]> {
          const response = await $api.get<ITeamCoachCaptainView[]>('/teams/teams-captain-coach');
          return response.data; 
     }

     static async createTeam(teamData: Partial<ITeam>): Promise<ITeam> {
          try {
               const response = await $api.post<ITeam>('/teams/', teamData);
               toast.success(`Команда "${teamData.team_name}" успешно создана!`)
               return response.data; 
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    toast.error(error.response.data.detail);
               } else {
                    console.error('Произошла ошибка при создании команды:', error.message);
                    toast.error('Произошла ошибка при создании команды');
               }
               throw error;
          }
     }

     static async deleteTeam(team_id: number): Promise<void> {
          try {
               await $api.delete(`/teams/${team_id}`);
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    toast.error(error.response.data.detail);
               } else {
                    console.error('Произошла ошибка при удалении команды:', error.message);
                    toast.error('Произошла ошибка при удалении команды');
               }
               throw error;
          }
     }

     static async updateTeam(teamData: ITeamCoachCaptainView): Promise<ITeamCoachCaptainView> {
          try {
              const response = await $api.put<ITeamCoachCaptainView>(`/teams/${teamData.team_id}`, teamData);
              return response.data;
          } catch (error: any) {
              if (error.response?.data?.detail) {
                  toast.error(error.response.data.detail);
              } else {
                  console.error('Произошла ошибка при обновлении названия команды:', error.message);
                  toast.error('Произошла ошибка при обновлении названия команды');
              }
              throw error;
          }
      }
      
}