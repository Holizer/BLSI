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

      async fetchMatchStatusTypes() {
            const result = await runWithLoader(() => MatchService.fetchMatchStatusTypes(), this.setLoading);
            if (result) {
                this.statusTypes = result;
            }
      }
      
      async fetchSheduledMactches(seasonId?: number, weekIds?: number) {
            const result = await runWithLoader(() => MatchService.fetchSheduledMactches(seasonId, weekIds), this.setLoading);
            if (result) {
                this.scheduledMatches = result;
            }
      }
      
      async fetchCanceledMactches(seasonId?: number, weekIds?: number) {
            const result = await runWithLoader(() => MatchService.fetchCanceledMactches(seasonId, weekIds), this.setLoading);
            if (result) {
                this.canceledMatches = result;
            }
      }

      async fetchCompletedMatches(seasonId?: number, weekIds?: number) {
            const result = await runWithLoader(() => MatchService.fetchCompletedMatches(seasonId, weekIds), this.setLoading);
            if (result) {
                this.complitedMathces = result;
            }
      }

      async fetchForfeitedMactches(seasonId?: number, weekIds?: number) {
            const result = await runWithLoader(() => MatchService.fetchForfeitedMactches(seasonId, weekIds), this.setLoading);
            if (result) {
                this.forfeitedMatches = result;
            }
      }

      async createMactch(matchData: IMatchCreator) {
            await runWithLoader(() => MatchService.createMatch(matchData), this.setLoading);
      }
}