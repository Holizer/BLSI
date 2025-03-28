import { PLAYER_MANAGMENT_ROUTE } from "../../frontend/src/const";
import PlayerManagment from "./pages/PlayerManagment/PlayerManagment.tsx";

export const publicRoutes = [
      {
            path: PLAYER_MANAGMENT_ROUTE,
            Component: PlayerManagment,
      },
]