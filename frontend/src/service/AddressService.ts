import $api from "../http";
import { toast } from "sonner";
import { IPlayerAddressView } from "@/models/player/IPlayerAddressView";
import { ICity } from "@/models/address/ICity";

export default class AddressService {
     static async fetchCities(): Promise<ICity[]> {
          try {
               const response = await $api.get<ICity[]>('/addresses/get-cities');
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить список игроков и их команд:", error);
               throw error;
          }
     }

     static async createCity(cityData: Partial<ICity>): Promise<ICity> {
          try {
               const response = await $api.post<ICity>('/addresses/create-city', cityData);
               toast.success(`Город ${cityData.city_name} создан успешно!`)
               return response.data; 
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    toast.error(error.response.data.detail);
               } else {
                    console.error('Произошла ошибка при создании города:', error.message);
               }
               throw error;
          }
     }

     static async deleteCity(city_id: number): Promise<void> {
          try {
               await $api.delete(`/addresses/delete-city/${city_id}`);
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    toast.error(error.response.data.detail);
               } else {
                    console.error('Произошла ошибка при удалении города:', error.message);
               }
               throw error;
          }
     }

     static async updateCityName(city_id: number, city_name: string): Promise<ICity> {
          try {
               const response = await $api.put<ICity>(`/addresses/update-city-name/${city_id}`, {city_name});
               return response.data; 
          } catch (error: any) {
               if (error.response?.data?.detail) {
                    toast.error(error.response.data.detail);
               } else {
                    console.error('Произошла ошибка при обновлении названия команды:', error.message);
               }
               throw error;
          }
     }

     static async fetchPlayerAddress(): Promise<IPlayerAddressView[]> {
          try {
               const response = await $api.get<IPlayerAddressView[]>('/addresses/get-player-address');
               return response.data; 
          } catch (error) {
               console.error("Неудалось получить список игроков и их команд:", error);
               throw error;
          }
     }

     static async updatePlayerAddress(playerAddressData: IPlayerAddressView): Promise<IPlayerAddressView> {
          try {
               const response = await $api.put<IPlayerAddressView>(`/addresses/update-player-address/${playerAddressData.player_id}`, playerAddressData);
               return response.data; 
          } catch (error: any) {
               toast.error(error.response.data.detail);
               throw error;
          }
     }

     static async deletePlayerAddress(player_id: number): Promise<void> {
          try {
               await $api.delete(`/addresses/delete-player-address/${player_id}`);
          } catch (error: any) {
               toast.error(error.response.data.detail);
               throw error;
          }
     }
}