import { ITeam } from "@/models/ITeam";
import { makeAutoObservable, toJS } from "mobx";
import TeamService from "../service/TeamService";
import { ITeamCoachCaptainView } from "@/views/ITeamCoachCaptainView";


export default class TeamsStore {
      teams: ITeam[] = [];
      teamsView: ITeamCoachCaptainView[] = [];
      loading = false;

      constructor() {
            makeAutoObservable(this);
            this.fetchTeamsList();
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

      async fetchTeamsWithCatainAndCoach() {
            this.loading = true;
            try {
                  this.teamsView = await TeamService.fetchTeamsWithCatainAndCoach();
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

      async deleteTeam(teamId: number) {
            this.loading = true;
            try {
                  await TeamService.deleteTeam(teamId);
            } catch (error) {
                  console.error("Неудалось обновить название команды:", error);
            } finally {
                  this.loading = false;
            }
      }



      // async updateTeam(teamData: ITeam) {
      //       this.loading = true;
      //       try {
      //             await TeamService.updateTeam(teamData);
      //       } catch (error) {
      //             console.error("Ошибка загрузки игроков:", error);
      //       } finally {
      //             this.loading = false;
      //       }
      // }
}