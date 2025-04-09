import { makeAutoObservable } from "mobx";
import { runWithLoader } from "../utilits/runWithLoader";
import { ISeasonWithWeeks } from "@/models/ISeasonWithWeeks";
import SeasonService from "../service/SeasonService";

export default class SeasonStore {
      loading = false;
      seasonWithWeeks: ISeasonWithWeeks[] = []; 

      constructor() {
            makeAutoObservable(this);
            this.fetchSeasonWithWeeks();
      }

      setLoading = (value: boolean) => {
            this.loading = value;
      };

      async fetchSeasonWithWeeks() {
            const result = await runWithLoader(() => SeasonService.fetchSeasonWithWeeks(), this.setLoading);
            if (result) {
                  this.seasonWithWeeks = result;
            }
      }

      get seasons() {
            return this.seasonWithWeeks;
      }

      get activeSeason() {
            return this.seasonWithWeeks[0]; 
      }
}