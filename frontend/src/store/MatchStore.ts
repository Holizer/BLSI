import { makeAutoObservable } from "mobx";
import { runWithLoader } from "../utilits/runWithLoader";
import MatchesService from "../service/MatchService";
import { IScheduledMatch } from "../models/views/IScheduledMatch";
import { IMatchStatusType } from "@/models/IMatchStatusType";

export default class MatchStore {
      scheduledMatches: IScheduledMatch[] = [];
      statusTypes: IMatchStatusType[] = [];
      loading = false;

      constructor() {
            makeAutoObservable(this)
      }
      
      setLoading = (value: boolean) => {
            this.loading = value;
      }            

      async fetchSheduledMacthes() {
            const result = await runWithLoader(() => MatchesService.fetchSheduledMacthes(), this.setLoading);
            if (result) {
                this.scheduledMatches = result;
            }
      }

      async fetchMatchStatusTypes() {
            const result = await runWithLoader(() => MatchesService.fetchMatchStatusTypes(), this.setLoading);
            if (result) {
                this.statusTypes = result;
            }
      }
}