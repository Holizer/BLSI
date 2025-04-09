import { useAppContext } from '../../hooks/useAppContext';
import classes from './Header.module.scss';
import { observer } from 'mobx-react-lite';

const Header = () => {
    const { seasonStore } = useAppContext();

    const currentSeason = seasonStore.activeSeason;
    
    return (
        <header>
            {/* <div className={classes.logoContainer}>
                <img src={logo} alt="Логотип лиги" className={classes.logo} />
            </div> */}
            <div className={classes.titleContainer}>
                <h1 className={classes.title}>Информационная система кегельной лиги</h1>
            </div>
            <div className={classes.infoContainer}>
                {currentSeason && (
                    <div className={classes.season}>
                        Сезон: {currentSeason.season_name}
                    </div>
                )}
                {currentSeason && (
                    <div className={classes.week}>
                        Игровая недля: {seasonStore.getLastWeekInSeason(currentSeason).week_number}
                    </div>
                )}
            </div>
        </header>
    );
};

export default observer(Header)