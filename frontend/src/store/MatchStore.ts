import { makeAutoObservable } from "mobx";
import { runWithLoader } from "../utilits/runWithLoader";
import MatchesService from "../service/MatchService";
import { IScheduledMatch } from "../models/views/IScheduledMatch";
import { IMatchStatusType } from "@/models/IMatchStatusType";
import { ICanceledMatch } from "@/models/views/ICanceledMatch";
import { IForfeitedMatch } from "@/models/views/IForfeitedMatch";

export default class MatchStore {
      scheduledMatches: IScheduledMatch[] = [];
      canceledMatches: ICanceledMatch[] = [];
      forfeitedMatches: IForfeitedMatch[] = [];
      statusTypes: IMatchStatusType[] = [];
      loading = false;

      constructor() {
            makeAutoObservable(this)
      }
      
      setLoading = (value: boolean) => {
            this.loading = value;
      }            

      async fetchMatchStatusTypes() {
            const result = await runWithLoader(() => MatchesService.fetchMatchStatusTypes(), this.setLoading);
            if (result) {
                this.statusTypes = result;
            }
      }
      
      async fetchSheduledMacthes() {
            const result = await runWithLoader(() => MatchesService.fetchSheduledMacthes(), this.setLoading);
            if (result) {
                this.scheduledMatches = result;
            }
      }
      
      async fetchCanceledMacthes() {
            const result = await runWithLoader(() => MatchesService.fetchCanceledMacthes(), this.setLoading);
            if (result) {
                this.canceledMatches = result;
            }
      }

      async fetchForfeitedMacthes() {
            const result = await runWithLoader(() => MatchesService.fetchForfeitedMacthes(), this.setLoading);
            if (result) {
                this.forfeitedMatches = result;
            }
      }
}