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
          const response = await $api.post<ITeam>('/teams/create', teamData);
          return response.data;
     }

     static async updateTeam(teamData: Partial<ITeam>): Promise<ITeam> {
          const response = await $api.put<ITeam>(`/teams/update/${teamData.team_id}`, teamData);
          return response.data;
     }
 }