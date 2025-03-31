import { ITeam } from "@/models/ITeam";
import $api from "../http";
import { ITeamCoachCaptainView } from "../views/ITeamCoachCaptainView";

export default class TeamService {
     static async fetchTeamsList(): Promise<ITeam[]> {
          const response = await $api.get<ITeam[]>('/teams/teams-list');
          return response.data; 
     }

     static async fetchTeamsWithCatainAndCoach(): Promise<ITeamCoachCaptainView[]> {
          const response = await $api.get<ITeamCoachCaptainView[]>('/teams/teams-captain-coach');
          return response.data; 
     }

     
     static async createTeam(teamData: Partial<ITeam>): Promise<ITeam> {
          try {
               const response = await $api.post<ITeam>('/teams/create', teamData);
               return response.data; 
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    alert(error.response.data.detail);
               } else {
                    console.log('Произошла ошибка при создании команды:', error.message);
                    alert('Произошла ошибка при создании команды');
               }
               throw error;
          }
     }

     static async deleteTeam(teamId: number): Promise<void> {
          try {
               await $api.delete(`/teams/delete/${teamId}`);
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    alert(error.response.data.detail);
               } else {
                    console.log('Произошла ошибка при удалении команды:', error.message);
                    alert('Произошла ошибка при удалении команды');
               }
               throw error;
          }
     }

     static async updateTeamName(teamData: ITeam): Promise<ITeam> {
          try {
               const response = await $api.put<ITeam>(`/teams/update-team-name/${teamData.team_id}`, teamData);
               return response.data; 
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    alert(error.response.data.detail);
               } else {
                    console.log('Произошла ошибка при обновлении названия команды:', error.message);
                    alert('Произошла ошибка при обновлении названия команды');
               }
               throw error;
          }
     }


     // static async updateTeam(teamData: ITeam): Promise<ITeam> {
     //      const response = await $api.put<ITeam>(`/teams/update/${teamData.team_id}`, teamData);
     //      return response.data;
     // }
 }