export interface IPlayer {
      player_id: number;
      first_name: string;
      last_name: string;
      age: number;
      phone: string;
      address_id?: number | null;
      team_id?: number | null;
}