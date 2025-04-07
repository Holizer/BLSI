import { makeAutoObservable } from "mobx";
import { runWithLoader } from "../utilits/runWithLoader";
import PlaygroundService from "../service/PlaygroundService";
import { ICancellationReason } from "../models/ICancellationReason";
import CancellationReasonService from "../service/CancellationReasonService";

export default class CancellationReasonStore {
      cancellation_reasons: ICancellationReason[] = [];
      loading = false;
  
      constructor() {
            makeAutoObservable(this)
      }
      
      setLoading = (value: boolean) => {
            this.loading = value;
      }            

      async fetchCancellationReason() {
            const result = await runWithLoader(() => CancellationReasonService.fetchCancellationReason(), this.setLoading);
            if (result) {
                this.cancellation_reasons = result;
            }
      }
      
      async createCancellationReason(reason: string) {
            await runWithLoader(() => CancellationReasonService.createCancellationReason(reason), this.setLoading);
      }

      async updateCancellationReason(cancellation_reason_data: ICancellationReason) {
            await runWithLoader(() => CancellationReasonService.updateCancellationReason(
                  cancellation_reason_data.cancellation_reason_id, cancellation_reason_data.reason
            ), this.setLoading);
      }
      
      async deleteCancellationReason(cancellation_reason_id: number) {
            await runWithLoader(() => CancellationReasonService.deleteCancellationReason(cancellation_reason_id), this.setLoading);
      }
}