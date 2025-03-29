import classes from './LeftSideBar.module.scss';
import Link from '../../UI/Link';
import { useLocation } from 'react-router-dom';
import { MATCHES_ROUTE, PLAYERS_ROUTE, TEAMS_ROUTE } from '../../const';

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
				</ul>
			</nav>
		</aside>
	);
};

export default LeftSideBar;
