import classes from './LeftSideBar.module.scss';
import { MATCHES_MANAGMENT_ROUTE, PLAYER_MANAGMENT_ROUTE, TEAMS_MANAGMENT_ROUTE } from '../../const';
import Link from '../../UI/Link';
import { useLocation } from 'react-router-dom';

const LeftSideBar = () => {
	const location = useLocation();

	return (
		<aside className={classes.sidebar__quicklinks}>
			<nav>
				<ul>
					<li className={classes.menuSection}>
						<Link 
							to={PLAYER_MANAGMENT_ROUTE} 
							className={`${classes.menuItem} ${location.pathname === PLAYER_MANAGMENT_ROUTE ? classes.active : ''}`}
						>
							Игроки
						</Link>
					</li>
					<li className={classes.menuSection}>
						<Link 
							to={PLAYER_MANAGMENT_ROUTE} 
							className={`${classes.menuItem} ${location.pathname === TEAMS_MANAGMENT_ROUTE ? classes.active : ''}`}
						>
							Команды
						</Link>
					</li>
					<li className={classes.menuSection}>
						<Link 
							to={PLAYER_MANAGMENT_ROUTE} 
							className={`${classes.menuItem} ${location.pathname === MATCHES_MANAGMENT_ROUTE ? classes.active : ''}`}
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
