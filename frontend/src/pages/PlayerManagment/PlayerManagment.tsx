import classes from './../../styles/layout.module.scss'
import searchIcon from '../../assets/icons/search.svg';

const PlayerManagment = () => {
	return (
		<div className={classes.layout__container}>
			<div className={classes.content__block}>
				<div className={classes.block__header}>
	          			<h1>Список игроков</h1>
					<button>
						<img src={searchIcon} alt="" />
					</button>
					<button>Редактировать</button>
				</div>
				<div className={classes.block__table}>
				</div>
			</div>
			
			<h1>Лучшие игроки недели</h1>
			<h1>Статистика игроков</h1>
			<h1>Лучшие игроки сезона</h1>
		</div>
	);
};

export default PlayerManagment;