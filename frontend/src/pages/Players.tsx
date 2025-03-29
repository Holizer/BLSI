import Search from '../UI/Search/Search';
import classes from './../styles/layout.module.scss'
import EditButton from '../UI/Edit/EditButton';
import { useContext, useEffect, useState } from 'react';
import Table from '../UI/Table/Table';
import { IPlayerTeamView } from '@/views/IPlayerTeamView';
import { TableColumn, TableConfig } from '@/types/table';
import { AppContext } from '..';

const playerTeamViewConfig: TableConfig<IPlayerTeamView> = {
	model: 'IPlayerTeamView',
	columns: [
		{ key: 'first_name', title: 'Имя', editable: true, type: 'text' },
		{ key: 'last_name', title: 'Фамилия', editable: true, type: 'text' },
		{ key: 'team_name', title: 'Команда', editable: true, type: 'select', options: ['Защитник', 'Нападающий', 'Вратарь'] },
	] as TableColumn<IPlayerTeamView>[],
};

const PlayersManager: React.FC = () => {
	const { playerStore } = useContext(AppContext)
	const [playerTeamView, setPlayerTeamView] = useState<IPlayerTeamView[] | undefined>();

	useEffect(() => {
		const fetchPlayerViewTeam = async () => {
			await playerStore.fetchPlayerTeamView();		
			setPlayerTeamView(playerStore.playerTeamView)
		}
		fetchPlayerViewTeam();
	}, [])

	const [isEditing, setIsEditing] = useState(false); 

	const handleSave = (updatedData: IPlayerTeamView[]) => {
		console.log('Updated players:', updatedData);
	};

	const toggleEditMode = () => {
		setIsEditing((prev) => !prev);
	};

	return (
		<main className={classes.layout__container}>
			<div className={classes.content__block}>
				<div className={classes.block__header}>
					<h2>Список игроков</h2>
					<Search />
					{/* <EditButton onClick={toggleEditMode} />  */}
				</div>
				<Table 
					config={playerTeamViewConfig} 
					data={playerTeamView || []}
					onSave={handleSave} 
					isEditing={isEditing}
					onToggleEdit={toggleEditMode}
				/>
			</div>
		</main>
	);
};

export default PlayersManager;
