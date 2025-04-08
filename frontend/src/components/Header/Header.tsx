import { toJS } from 'mobx';
import { useAppContext } from '../../hooks/useAppContext';
import classes from './Header.module.scss';
// import logo from './';

const Header = () => {
    const { seasonStore } = useAppContext();
    const currentSeason = seasonStore.activeSeason;

    return (
        <header className={classes.header}>
            <div className={classes.logoContainer}>
                {/* <img src={logo} alt="Логотип лиги" className={classes.logo} /> */}
            </div>
            <div className={classes.titleContainer}>
                <h1 className={classes.title}>Информационная система кегельной лиги</h1>
            </div>
            <div className={classes.infoContainer}>
                <div className={classes.season}>
                    Сезон: {currentSeason.season_name}
                </div>
                {/* <div className={classes.week}>Неделя: {}</div> */}
            </div>
        </header>
    );
};

export default Header;