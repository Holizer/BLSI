import { ITeam } from "@/models/ITeam";
import TeamService from "../service/TeamService";
import { ITeamCoachCaptainView } from "@/models/views/ITeamCoachCaptainView";
import { makeAutoObservable } from "mobx";
import { runWithLoader } from "../utilits/runWithLoader";

export default class TeamStore {
      teams: ITeam[] = [];
      teamsDetailed: ITeamCoachCaptainView[] = [];

      loading = false;
  
      constructor() {
            makeAutoObservable(this)
            this.loadTeams()
      }
      
      setLoading = (value: boolean) => {
            this.loading = value;
      }            

      async loadTeams() {
            const result = await runWithLoader(() => TeamService.fetchTeamsList(), this.setLoading);
            console.log("result", result)
            if (result) {
                this.teams = result;
            }
      }

      async loadTeamsDetailed() {
            const result = await runWithLoader(() => TeamService.fetchTeamsWithCaptainAndCoach(), this.setLoading);
            if (result) this.teamsDetailed = result;
      }
    
      async loadAllTeamsData() {
            await Promise.all([
                this.loadTeams(),
                this.loadTeamsDetailed()
            ]);
      }

      async fetchTeamsList() {
            this.setLoading(true)
            try {
                  this.teams = await TeamService.fetchTeamsList();
            } catch (error) {
                  console.error("Ошибка загрузки игроков:", error);
            } finally {
                  this.setLoading(false)
            }
      }

      async createTeam(teamData: Partial<ITeam>) {
            this.setLoading(true)
            try {
                  await TeamService.createTeam(teamData);
            } catch (error) {
                  console.error("Ошибка загрузки игроков:", error);
            } finally {
                  this.setLoading(false)
            }
      }

      async updateTeamName(teamData: ITeam) {
            this.setLoading(true)
            try {
                  await TeamService.updateTeamName(teamData);
            } catch (error) {
                  console.error("Неудалось обновить название команды:", error);
            } finally {
                  this.setLoading(false)
            }
      }

      async deleteTeam(team_id: number) {
            this.setLoading(true)
            try {
                  await TeamService.deleteTeam(team_id);
            } catch (error) {
                  console.error("Неудалось удалить команду:", error);
            } finally {
                  this.setLoading(false)
            }
      }
}