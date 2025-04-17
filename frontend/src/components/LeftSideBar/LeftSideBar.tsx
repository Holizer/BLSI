import classes from './LeftSideBar.module.scss';
import Link from '../../UI/Link';
import { useLocation } from 'react-router-dom';
import { ADDREESES_ROUTE, MATCHES_ROUTE, PLAYERS_ROUTE, PLAYGROUNDS_ROUTE, SEASONS_ROUTE, TEAMS_ROUTE } from '../../const';

const LeftSideBar = () => {
	const location = useLocation();

	return (
		<aside className={classes.sidebar__quicklinks}>
			<nav>
				<ul>
					<li className={classes.menuSection}>
						<Link 
							to={PLAYERS_ROUTE} 
							className={`${classes.menuItem} ${location.pathname === PLAYERS_ROUTE ? classes.active : ''}`}
						>
							Игроки
						</Link>
					</li>
					<li className={classes.menuSection}>
						<Link 
							to={ADDREESES_ROUTE} 
							className={`${classes.menuItem} ${location.pathname === ADDREESES_ROUTE ? classes.active : ''}`}
						>
							Адреса
						</Link>
					</li>
					<li className={classes.menuSection}>
						<Link 
							to={TEAMS_ROUTE} 
							className={`${classes.menuItem} ${location.pathname === TEAMS_ROUTE ? classes.active : ''}`}
						>
							Команды
						</Link>
					</li>
					<li className={classes.menuSection}>
						<Link 
							to={MATCHES_ROUTE} 
							className={`${classes.menuItem} ${location.pathname === MATCHES_ROUTE ? classes.active : ''}`}
						>
							Матчи
						</Link>
					</li>
					<li className={classes.menuSection}>
						<Link 
							to={PLAYGROUNDS_ROUTE} 
							className={`${classes.menuItem} ${location.pathname === PLAYGROUNDS_ROUTE ? classes.active : ''}`}
						>
							Игровые площадки
						</Link>
					</li>
					<li className={classes.menuSection}>
						<Link 
							to={SEASONS_ROUTE} 
							className={`${classes.menuItem} ${location.pathname === SEASONS_ROUTE ? classes.active : ''}`}
						>
							Сезоны
						</Link>
					</li>
				</ul>
			</nav>
		</aside>
	);
};

export default LeftSideBar;
