import { ITeam } from "@/models/ITeam";
import { makeAutoObservable, toJS } from "mobx";
import TeamService from "../service/TeamService";
import { ITeamCoachCaptainView } from "@/views/ITeamCoachCaptainView";


export default class TeamsStore {
      teams: ITeam[] = [];
      teamsDetailed: ITeamCoachCaptainView[] = [];
      loading = false;
  
      constructor() {
          makeAutoObservable(this);
          this.loadTeams();
      }

      private async safeFetch<T>(fetchFn: () => Promise<T>): Promise<T | null> {
            this.loading = true;
            try {
                return await fetchFn();
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
                return null;
            } finally {
                this.loading = false;
            }
      }
    
      async loadTeams() {
            const result = await this.safeFetch(() => TeamService.fetchTeamsList());
            if (result) this.teams = result;
      }
    
      async loadTeamsDetailed() {
            const result = await this.safeFetch(() => TeamService.fetchTeamsWithCaptainAndCoach());
            if (result) this.teamsDetailed = result;
      }
    
      async loadAllTeamsData() {
            await Promise.all([
                this.loadTeams(),
                this.loadTeamsDetailed()
            ]);
      }

      async fetchTeamsList() {
            this.loading = true;
            try {
                  this.teams = await TeamService.fetchTeamsList();
            } catch (error) {
                  console.error("Ошибка загрузки игроков:", error);
            } finally {
                  this.loading = false;
            }
      }

      async createTeam(teamData: Partial<ITeam>) {
            this.loading = true;
            try {
                  await TeamService.createTeam(teamData);
            } catch (error) {
                  console.error("Ошибка загрузки игроков:", error);
            } finally {
                  this.loading = false;
            }
      }

      async updateTeamName(teamData: ITeam) {
            this.loading = true;
            try {
                  await TeamService.updateTeamName(teamData);
            } catch (error) {
                  console.error("Неудалось обновить название команды:", error);
            } finally {
                  this.loading = false;
            }
      }

      async deleteTeam(team_id: number) {
            this.loading = true;
            try {
                  await TeamService.deleteTeam(team_id);
            } catch (error) {
                  console.error("Неудалось удалить команду:", error);
            } finally {
                  this.loading = false;
            }
      }
}