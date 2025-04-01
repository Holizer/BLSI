import { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import PlayerStore from './store/PlayerStore';
import TeamStore from './store/TeamStore';
import AddressStore from './store/AddressStore';

interface State {
     playerStore: PlayerStore,
     teamStore: TeamStore,
     addressStore: AddressStore,
}

const playerStore = new PlayerStore();
const teamStore = new TeamStore();
const addressStore = new AddressStore();

export const AppContext = createContext<State>({
     playerStore,
     teamStore,
     addressStore,
});

const root = ReactDOM.createRoot(
     document.getElementById('root') as HTMLElement
);

root.render(
     <BrowserRouter>
          <AppContext value={{
               playerStore, teamStore, addressStore
          }}>
               <App />
          </AppContext>
     </BrowserRouter>
);
