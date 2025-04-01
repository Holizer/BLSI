import { Toaster } from "sonner";
import classes from './styles/App.module.scss';
import LeftSideBar from '../../frontend/src/components/LeftSideBar/LeftSideBar';
import RightSidebarBar from '../../frontend/src/components/RightSideBar/RightSideBar';
import { Navigate, Route, Routes } from 'react-router-dom';
import { publicRoutes } from './routes';
import { observer } from 'mobx-react-lite';
import './styles/normalize.css';
import Header from '../../frontend/src/components/Header/Header';
import { PLAYERS_ROUTE } from './const';

const App = () => {
    return (
        <div className={classes.Application}>
            <Header/>
            <div className={classes.grid__container}>
                <LeftSideBar />
                <Routes>
                    <Route path="/" element={<Navigate to={PLAYERS_ROUTE} replace />} />
                    {publicRoutes.map(({ path, Component }) => (
                        <Route key={path} path={path} element={<Component /> } />
                    ))}
                </Routes>
                <RightSidebarBar />
            </div>
            <Toaster position="top-center" />
        </div>
    );
};

export default observer(App);
