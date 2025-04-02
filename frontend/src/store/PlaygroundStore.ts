import { makeAutoObservable } from "mobx";
import { runWithLoader } from "../utilits/runWithLoader";
import { ICoachTeam } from "@/models/ICoach";
import CoachService from "../service/CoachService";
import { IPlaygroundType } from "@/models/IPlaygroundType";
import PlayerService from "@/service/PlayerService";
import PlaygroundService from "../service/PlaygroundService";
import { IPlaygroundFullInfo } from "@/models/IPlaygroundFullInfo";

export default class PlaygroundStore {
      playgrounds: IPlaygroundFullInfo[] = [];
      playground_types: IPlaygroundType[] = [];
      loading = false;
  
      constructor() {
            makeAutoObservable(this)
      }
      
      setLoading = (value: boolean) => {
            this.loading = value;
      }            

      async fetchPlaygroundTypes() {
            const result = await runWithLoader(() => PlaygroundService.fetchPlaygroundTypes(), this.setLoading);
            if (result) {
                this.playground_types = result;
            }
      }

      async fetchPlaygroundsFullInfo() {
            const result = await runWithLoader(() => PlaygroundService.fetchPlaygroundsFullInfo(), this.setLoading);
            if (result) {
                this.playgrounds = result;
            }
      }

      // async createCoach(coachData: Partial<ICoachTeam>) {
      //       await runWithLoader(() => CoachService.createCoach(coachData), this.setLoading);
      // }

      // async updateCoach(coachData: ICoachTeam) {
      //       await runWithLoader(() => CoachService.updateCoach(coachData), this.setLoading);
      // }

      // async deleteCoach(coach_id: number) {
      //       await runWithLoader(() => CoachService.deleteCoach(coach_id), this.setLoading);
      // }
}