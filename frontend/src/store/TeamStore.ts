import { ITeam } from "@/models/team/ITeam";
import TeamService from "../service/TeamService";
import { ITeamCoachCaptainView } from "@/models/teamCoachCapitan/ITeamCoachCaptainView";
import { makeAutoObservable } from "mobx";
import { runWithLoader } from "../utilits/runWithLoader";

export default class TeamStore {
      teams: ITeam[] = [];
      teamsDetailed: ITeamCoachCaptainView[] = [];
      loading = false;
  
      constructor() {
            makeAutoObservable(this)
            this.fetchTeamsList()
      }
      
      setLoading = (value: boolean) => {
            this.loading = value;
      }            

      async fetchTeamsList() {
            const result = await runWithLoader(() => TeamService.fetchTeamsList(), this.setLoading);
            if (result) {
                this.teams = result;
            }
      }

      async fetchTeamsWithCaptainAndCoach() {
            const result = await runWithLoader(() => TeamService.fetchTeamsWithCaptainAndCoach(), this.setLoading);
            if (result) this.teamsDetailed = result;
      }
    
      async loadAllTeamsData() {
            await Promise.all([
                this.fetchTeamsList(),
                this.fetchTeamsWithCaptainAndCoach()
            ]);
      }

      async createTeam(teamData: Partial<ITeam>) {
            await runWithLoader(() => TeamService.createTeam(teamData), this.setLoading);
      }

      async updateTeam(teamData: ITeamCoachCaptainView) {
            await runWithLoader(() => TeamService.updateTeam(teamData), this.setLoading);
      }

      async deleteTeam(team_id: number) {
            await runWithLoader(() => TeamService.deleteTeam(team_id), this.setLoading);
      }

      getTeamName(team_id: number) {
            return this.teams.find(team => team.team_id === team_id)?.team_name;
      }
}