import $api from "../http";
import { toast } from "sonner";
import { ICancellationReason } from "../models/ICancellationReason";

export default class CancellationReasonService {
     static async fetchCancellationReason(): Promise<ICancellationReason[]> {
          try {
               const response = await $api.get<ICancellationReason[]>('/cancellation_reasons');
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить причин отмены матчей:", error);
               throw error;
          }
     }

     static async createCancellationReason(reason: string): Promise<ICancellationReason> {
          try {
               const response = await $api.post<ICancellationReason>('/cancellation_reasons/', reason);
               toast.success(`Добавлена новая причина отмены матча!`)
               return response.data; 
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    toast.error(error.response.data.detail);
               } else {
                    console.error('Произошла ошибка при создании причины отмены матча:', error.message);
               }
               throw error;
          }
     }

     static async deleteCancellationReason(cancellation_reason_id: number): Promise<void> {
          try {
               await $api.delete(`/cancellation_reasons/${cancellation_reason_id}`);
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    toast.error(error.response.data.detail);
               } else {
                    console.error('Произошла ошибка при причины отмены матча:', error.message);
               }
               throw error;
          }
     }

     static async updateCancellationReason(cancellation_reason_id: number, reason: string): Promise<ICancellationReason> {
          try {
               const response = await $api.put<ICancellationReason>(`/cancellation_reasons/${cancellation_reason_id}`, { reason } );
               return response.data; 
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    toast.error(error.response.data.detail);
               } else {
                    console.error('Произошла ошибка при обновлении причины отмены матча:', error.message);
               }
               throw error;
          }
     }
}