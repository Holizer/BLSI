import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AppContext, contextValue } from './AppContext';

const root = ReactDOM.createRoot(
     document.getElementById('root') as HTMLElement
);

root.render(
     <BrowserRouter>
          <AppContext.Provider value={contextValue} >
               <App />
          </AppContext.Provider>
     </BrowserRouter>
);
