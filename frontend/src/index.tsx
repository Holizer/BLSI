import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import PlayerStore from './store/PlayerStore';
import TeamsStore from './store/TeamsStore';

interface State {
     playerStore: PlayerStore,
     teamStore: TeamsStore,
}

const playerStore = new PlayerStore();
const teamStore = new TeamsStore();

export const AppContext = createContext<State>({
     playerStore,
     teamStore,
});

const root = ReactDOM.createRoot(
     document.getElementById('root') as HTMLElement
);

root.render(
     <BrowserRouter>
          <AppContext value={{
               playerStore, teamStore
          }}>
               <App />
          </AppContext>
     </BrowserRouter>
);
