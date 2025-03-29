import { IPlayer } from "@/models/IPlayer";
import $api from "../http";
import { IPlayerTeamView } from "../views/IPlayerTeamView";

export default class PlayerService {
     static async fetchPlayerTeamView(): Promise<IPlayerTeamView[]> {
          const response = await $api.get<IPlayerTeamView[]>('/players/player_team');
          return response.data; 
     }

     static async fetchPlayersList(): Promise<IPlayer[]> {
          const response = await $api.get<IPlayer[]>('/players/players-list');
          return response.data; 
     }
 }