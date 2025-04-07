import { IPlayerAddressView } from "@/models/views/IPlayerAddressView";
import AddressService from "../service/AddressService";
import { ICity } from "@/models/ICity";
import { makeAutoObservable } from "mobx";
import { runWithLoader } from "../utilits/runWithLoader";

export default class AddressStore {
    cities: ICity[] = [];
    playerAddresses: IPlayerAddressView[] = [];

    loading = false;

    constructor() {
        makeAutoObservable(this);
        this.fecthCities();
    }

    setLoading = (value: boolean) => {
        this.loading = value;
    } 

    async fecthCities() {
        const result = await runWithLoader(() => AddressService.fetchCities(), this.setLoading );
        if (result) this.cities = result;
    }

    async fetchPlayerAddresses() {
        const result = await runWithLoader(() => AddressService.fetchPlayerAddress(), this.setLoading);
        if (result) this.playerAddresses = result;
    }
    
    async loadAllAddressesData() {
        await Promise.all([
            this.fecthCities(),
            this.fetchPlayerAddresses()
        ]);
    }

    //#region IPlayerAddressView
    async deletePlayerAddress(player_id: number) {
        await runWithLoader(() => AddressService.deletePlayerAddress(player_id), this.setLoading);
    }

    async updatePlayerAddress(addressData: IPlayerAddressView) {
        await runWithLoader(() => AddressService.updatePlayerAddress(addressData), this.setLoading);
    }
    //#endregion


    //#region ГОРОДА
    async createCity(cityData: Partial<ICity>) {
        await runWithLoader(() => AddressService.createCity(cityData), this.setLoading);
    }

    async deleteCity(city_id: number) {
        await runWithLoader(() => AddressService.deleteCity(city_id), this.setLoading);
    }

    async updateCityName(cityData: ICity) {
        await runWithLoader(() => AddressService.updateCityName(cityData.city_id, cityData.city_name), this.setLoading);
    }
    //#endregion
}