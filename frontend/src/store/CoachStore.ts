import { makeAutoObservable } from "mobx";
import { runWithLoader } from "../utilits/runWithLoader";
import { ICoachTeam } from "@/models/ICoach";
import CoachService from "../service/CoachService";

export default class CoachStore {
      coaches: ICoachTeam[] = [];
      loading = false;
  
      constructor() {
            makeAutoObservable(this)
            this.fetchCoaches()
      }
      
      setLoading = (value: boolean) => {
            this.loading = value;
      }            

      async fetchCoaches() {
            const result = await runWithLoader(() => CoachService.fetchCoaches(), this.setLoading);
            if (result) {
                this.coaches = result;
            }
      }

      async createCoach(coachData: Partial<ICoachTeam>) {
            await runWithLoader(() => CoachService.createCoach(coachData), this.setLoading);
      }

      async updateCoach(coachData: ICoachTeam) {
            await runWithLoader(() => CoachService.updateCoach(coachData), this.setLoading);
      }

      async deleteCoach(coach_id: number) {
            await runWithLoader(() => CoachService.deleteCoach(coach_id), this.setLoading);
      }
}