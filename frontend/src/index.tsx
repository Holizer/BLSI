import { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import PlayerStore from './store/PlayerStore';
import TeamStore from './store/TeamStore';
import AddressStore from './store/AddressStore';
import CoachStore from './store/CoachStore';
import PlaygroundStore from './store/PlaygroundStore';

interface State {
     playerStore: PlayerStore,
     teamStore: TeamStore,
     addressStore: AddressStore,
     coachStore: CoachStore,
     playgroundStore: PlaygroundStore,
}

const playerStore = new PlayerStore();
const teamStore = new TeamStore();
const addressStore = new AddressStore();
const coachStore = new CoachStore();
const playgroundStore = new PlaygroundStore();

export const AppContext = createContext<State>({
     playerStore,
     teamStore,
     addressStore,
     coachStore,
     playgroundStore,
});

const root = ReactDOM.createRoot(
     document.getElementById('root') as HTMLElement
);

root.render(
     <BrowserRouter>
          <AppContext value={{
               playerStore, teamStore, addressStore, coachStore,
               playgroundStore,
          }}>
               <App />
          </AppContext>
     </BrowserRouter>
);
