import { makeAutoObservable } from "mobx";
import { runWithLoader } from "../utilits/runWithLoader";
import MatchService from "../service/MatchService";
import { IScheduledMatch } from "../models/match/IScheduledMatch";
import { IMatchStatusType } from "@/models/matchStatus/IMatchStatusType";
import { ICanceledMatch } from "@/models/match/ICanceledMatch";
import { IForfeitedMatch } from "@/models/match/IForfeitedMatch";
import { ICompletedMatch } from "@/models/match/ICompletedMatch";
import { IMatchCreator } from "@/models/creators/IMatchCreator";

export default class MatchStore {
      scheduledMatches: IScheduledMatch[] = [];
      canceledMatches: ICanceledMatch[] = [];
      forfeitedMatches: IForfeitedMatch[] = [];
      complitedMathces: ICompletedMatch[] = [];

      statusTypes: IMatchStatusType[] = [];
      loading = false;

      constructor() {
            makeAutoObservable(this)
            this.fetchMatchStatusTypes();
      }
      
      setLoading = (value: boolean) => {
            this.loading = value;
      }            

      async loadAllMatches() {
            await Promise.all([
                this.fetchSheduledMactches(),
                this.fetchCanceledMactches(),
                this.fetchCompletedMatches(),
                this.fetchForfeitedMactches(),
            ]);
      }


      async fetchMatchStatusTypes() {
            const result = await runWithLoader(() => MatchService.fetchMatchStatusTypes(), this.setLoading);
            if (result) {
                this.statusTypes = result;
            }
      }
      
      async fetchSheduledMactches() {
            const result = await runWithLoader(() => MatchService.fetchSheduledMactches(), this.setLoading);
            if (result) {
                this.scheduledMatches = result;
            }
      }
      
      async fetchCanceledMactches() {
            const result = await runWithLoader(() => MatchService.fetchCanceledMactches(), this.setLoading);
            if (result) {
                this.canceledMatches = result;
            }
      }

      async fetchCompletedMatches() {
            const result = await runWithLoader(() => MatchService.fetchCompletedMatches(), this.setLoading);
            if (result) {
                this.complitedMathces = result;
            }
      }

      async fetchForfeitedMactches() {
            const result = await runWithLoader(() => MatchService.fetchForfeitedMactches(), this.setLoading);
            if (result) {
                this.forfeitedMatches = result;
            }
      }

      async createMactch(matchData: IMatchCreator) {
            await runWithLoader(() => MatchService.createMatch(matchData), this.setLoading);
      }
}