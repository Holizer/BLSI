import { ADDREESES_ROUTE, MATCHES_ROUTE, PLAYERS_ROUTE, TEAMS_ROUTE } from "./const";
import Addresses from "./pages/Addresses";
import Matches from "./pages/Matches";
import Players from "./pages/Players";
import Teams from "./pages/Teams";

export const publicRoutes = [
      {
            path: PLAYERS_ROUTE,
            Component: Players,
      },
      {
            path: TEAMS_ROUTE,
            Component: Teams,
      },
      {
            path: MATCHES_ROUTE,
            Component: Matches,
      },
      {
            path: ADDREESES_ROUTE,
            Component: Addresses,
      },
]