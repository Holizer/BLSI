import classes from './Header.module.scss';
// import logo from './';

const Header = () => {
    const currentSeason = "Весна 2024";
    const gameWeek = "12–18 мая";

    return (
        <header className={classes.header}>
            <div className={classes.logoContainer}>
                {/* <img src={logo} alt="Логотип лиги" className={classes.logo} /> */}
            </div>
            <div className={classes.titleContainer}>
                <h1 className={classes.title}>Информационная система кегельной лиги</h1>
            </div>
            <div className={classes.infoContainer}>
                <div className={classes.season}>Сезон: {currentSeason}</div>
                <div className={classes.week}>Неделя: {gameWeek}</div>
            </div>
        </header>
    );
};

export default Header;