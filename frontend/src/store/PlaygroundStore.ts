import { makeAutoObservable } from "mobx";
import { runWithLoader } from "../utilits/runWithLoader";
import { IPlaygroundType } from "@/models/playground/IPlaygroundType";
import PlaygroundService from "../service/PlaygroundService";
import { IPlayground } from "@/models/playground/IPlayground";
import { IPlaygroundCreator } from "@/models/creators/IPlaygroundCreator";

export default class PlaygroundStore {
      playgrounds: IPlayground[] = [];
      playground_types: IPlaygroundType[] = [];
      loading = false;
  
      constructor() {
            makeAutoObservable(this)
            this.fetchPlaygrounds()
      }
      
      setLoading = (value: boolean) => {
            this.loading = value;
      }            

      
      async fetchPlaygrounds() {
            const result = await runWithLoader(() => PlaygroundService.fetchPlaygrounds(), this.setLoading);
            if (result) {
                this.playgrounds = result;
            }
      }
      
      async createPlayground(new_playground: IPlaygroundCreator) {
            await runWithLoader(() => PlaygroundService.createPlayground(new_playground), this.setLoading);
      }

      async updatePlayground(playground_data: IPlayground) {
            await runWithLoader(() => PlaygroundService.updatePlayground(
                  playground_data.playground_id, playground_data.playground_name,
                  playground_data.capacity, playground_data.playground_type_id
            ), this.setLoading);
      }
      
      async deletePlayground(playground_id: number) {
            await runWithLoader(() => PlaygroundService.deletePlayground(playground_id), this.setLoading);
      }
      
      
      async fetchPlaygroundTypes() {
            const result = await runWithLoader(() => PlaygroundService.fetchPlaygroundTypes(), this.setLoading);
            if (result) {
                this.playground_types = result;
            }
      }

      async createPlaygroundType(playground_type: string) {
            await runWithLoader(() => PlaygroundService.createPlaygroundType(playground_type), this.setLoading);
      }

      async updatePlaygroundType(playground_type_data: IPlaygroundType) {
            await runWithLoader(() => PlaygroundService.updatePlaygroundType(playground_type_data.playground_type_id, playground_type_data.playground_type), this.setLoading);
      }
      
      async deletePlaygroundType(playground_type_id: number) {
            await runWithLoader(() => PlaygroundService.deletePlaygroundType(playground_type_id), this.setLoading);
      }
}