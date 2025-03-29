import Search from '../../UI/Search/Search';
import classes from './../../styles/layout.module.scss'
import EditButton from '../../UI/Edit/EditButton';
import { useState } from 'react';
import Table from '../../UI/Table/Table';
import { IPlayerTeamView } from '@/view/IPlayerTeamView';
import { TableColumn, TableConfig } from '@/types/table';

const initialData: IPlayerTeamView[] = [
	{ player_id: 1, team_id: 1, first_name: 'Иван', last_name: 'Иванов', team_name: 'Снайперы' },
	{ player_id: 2, team_id: 2, first_name: 'Петр', last_name: 'Петров', team_name: 'Буллиты' },
];

const playerTeamViewConfig: TableConfig<IPlayerTeamView> = {
	model: 'IPlayerTeamView',
	columns: [
		{ key: 'first_name', title: 'Имя', editable: true, type: 'text' },
		{ key: 'last_name', title: 'Фамилия', editable: true, type: 'text' },
		{ key: 'team_name', title: 'Команда', editable: true, type: 'select', options: ['Защитник', 'Нападающий', 'Вратарь'] },
	] as TableColumn<IPlayerTeamView>[],
};

const PlayerManagement: React.FC = () => {
	const [players, setPlayers] = useState(initialData);
	const [isEditing, setIsEditing] = useState(false); 

	const handleSave = (updatedData: IPlayerTeamView[]) => {
		console.log('Updated players:', updatedData);
		setPlayers(updatedData);
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
					<EditButton onClick={toggleEditMode} /> 
				</div>
				<Table 
					config={playerTeamViewConfig} 
					data={players} 
					onSave={handleSave} 
					isEditing={isEditing}
					onToggleEdit={toggleEditMode}
				/>
			</div>
		</main>
	);
};

export default PlayerManagement;
