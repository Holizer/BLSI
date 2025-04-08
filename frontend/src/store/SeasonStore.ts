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

      // Основной метод загрузки данных
      async fetchSeasonWithWeeks() {
            const result = await runWithLoader(() => SeasonService.fetchSeasonWithWeeks(), this.setLoading);
            if (result) {
                  this.seasonWithWeeks = result;
            }
      }

      // Получение всех сезонов
      get seasons() {
            return this.seasonWithWeeks;
      }

      // Получение активного сезона (первого в списке или по условию)
      get activeSeason() {
            return this.seasonWithWeeks[0]; // или другая логика определения активного сезона
      }

      // Получение названия активного сезона
      get activeSeasonName() {
            return this.activeSeason?.season_name || "Сезон не выбран";
      }

      // Получение всех недель активного сезона
      get weeksOfActiveSeason() {
            return this.activeSeason?.weeks || [];
      }

      getWeekById(weekId: number) {
            return this.weeksOfActiveSeason.find(week => week.week_id === weekId);
      }

      get currentWeek() {
            return this.weeksOfActiveSeason[0]; // или другая логика определения текущей недели
      }

      getSeasonById(seasonId: number) {
            return this.seasonWithWeeks.find(season => season.season_id === seasonId);
      }

      getWeeksBySeasonId(seasonId: number) {
            return this.getSeasonById(seasonId)?.weeks || [];
      }
}