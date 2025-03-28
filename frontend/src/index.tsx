// import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// interface State {}

// export const AppContext = createContext<State>({});

const root = ReactDOM.createRoot(
     document.getElementById('root') as HTMLElement
);

root.render(
     <BrowserRouter>
          <App />
     </BrowserRouter>
);
