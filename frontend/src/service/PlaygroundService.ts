import $api from "../http";
import { toast } from "sonner";
import { IPlaygroundType } from "@/models/IPlaygroundType";
import { IPlayground } from "@/models/IPlayground";
import { IPlaygroundCreator } from "@/models/creators/IPlaygroundCreator";

export default class PlaygroundService {
     static async fetchPlaygroundTypes(): Promise<IPlaygroundType[]> {
          try {
               const response = await $api.get<IPlaygroundType[]>('/playgrounds/types');
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить список тренеров:", error);
               throw error;
          }
     }
     
     static async fetchPlaygrounds(): Promise<IPlayground[]> {
          try {
               const response = await $api.get<IPlayground[]>('/playgrounds');
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить список тренеров:", error);
               throw error;
          }
     }

     static async createPlayground(newPlayground: IPlaygroundCreator): Promise<IPlayground> {
          try {
               const response = await $api.post<IPlayground>('/playgrounds/', newPlayground);
               toast.success(`Площадка ${newPlayground.playground_name} успешно создана!`)
               return response.data; 
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    toast.error(error.response.data.detail);
               } else {
                    console.error('Произошла ошибка при создании площадки:', error.message);
               }
               throw error;
          }
     }

     static async deletePlayground(playground_id: number): Promise<void> {
          try {
               await $api.delete(`/playgrounds/${playground_id}`);
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    toast.error(error.response.data.detail);
               } else {
                    console.error('Произошла ошибка при удалении площадки:', error.message);
               }
               throw error;
          }
     }

     static async updatePlayground(playground_id: number, playground_name: string, capacity: number, playground_type_id: number): Promise<IPlayground> {
          try {
               const response = await $api.put<IPlayground>(`/playgrounds/${playground_id}`, { playground_name, capacity, playground_type_id } );
               return response.data; 
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    toast.error(error.response.data.detail);
               } else {
                    console.error('Произошла ошибка при обновлении площадки:', error.message);
               }
               throw error;
          }
     }

     
     static async createPlaygroundType(playground_type: string): Promise<IPlaygroundType> {
          try {
               const response = await $api.post<IPlaygroundType>('/playgrounds/types/', playground_type);
               toast.success(`Новый вид площадки "${playground_type}" успешно создан!`)
               return response.data; 
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    toast.error(error.response.data.detail);
               } else {
                    console.error('Произошла ошибка при создании типа площадки:', error.message);
               }
               throw error;
          }
     }

     static async deletePlaygroundType(playground_type_id: number): Promise<void> {
          try {
               await $api.delete(`/playgrounds/types/${playground_type_id}`);
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    toast.error(error.response.data.detail);
               } else {
                    console.error('Произошла ошибка при удалении типа площадки:', error.message);
               }
               throw error;
          }
     }

     static async updatePlaygroundType(playground_type_id: number, playground_type: string): Promise<IPlaygroundType> {
          try {
               const response = await $api.put<IPlaygroundType>(`/playgrounds/types/${playground_type_id}`, { playground_type } );
               return response.data; 
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    toast.error(error.response.data.detail);
               } else {
                    console.error('Произошла ошибка при обновлении площадки:', error.message);
               }
               throw error;
          }
     }
}