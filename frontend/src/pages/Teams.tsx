import { useContext, useEffect, useState } from 'react';
import classes from './../styles/layout.module.scss';
import { TableColumn, TableConfig } from '@/types/table';
import { ITeamCoachCaptainView } from '../views/ITeamCoachCaptainView';
import { AppContext } from '../index';
import Search from '../UI/Search/Search';
import EditButton from '../UI/Edit/EditButton';
import Table from '../UI/Table/Table';
import CreateTeamForm from '../components/CreateTeamForm/CreateTeamForm';

const teamCoachCaptainViewConfig: TableConfig<ITeamCoachCaptainView> = {
	model: 'ITeamCoachCaptainView',
	columns: [
		{ key: 'team_name', title: 'Команда', type: 'text' },
		{ key: 'captain_name', title: 'Капитан', editable: true, type: 'text' },
		{ key: 'coach_name', title: 'Тренер', editable: true, type: 'text' },
		{ key: 'delete', title: 'Удалить', type: 'button' },
	] as TableColumn<ITeamCoachCaptainView>[],
};

const Teams = () => {
	const { teamStore } = useContext(AppContext)
	const [teamsView, setTeamsView] = useState<ITeamCoachCaptainView[] | undefined>();

	useEffect(() => {
		const fetchTeamsWithCatainAndCoach = async () => {
			await teamStore.fetchTeamsWithCatainAndCoach();	
			setTeamsView(teamStore.teamsView)
		}
		fetchTeamsWithCatainAndCoach();
	}, [])

	const [isEditing, setIsEditing] = useState(false); 

	const handleSave = (updatedData: ITeamCoachCaptainView[]) => {
		console.log('Updated players:', updatedData);
	};

	const toggleEditMode = () => {
		setIsEditing((prev) => !prev);
	};

	return (
		<main className={classes.layout__container}>
			<div className={classes.content__block}>
				<div className={classes.block__header}>
					<h2>Список команд</h2>
					<Search />
					<EditButton  
						isEditing={isEditing} 
        					onEdit={toggleEditMode} 
        					onCancel={() => setIsEditing(false)}
					/> 
				</div>
				<Table 
					config={teamCoachCaptainViewConfig} 
					data={teamsView || []}
					onSave={handleSave} 
					isEditing={isEditing}
					onToggleEdit={toggleEditMode}
				/>
			</div>
			<div className={classes.content__block}>
				<div className={classes.block__header}>
					<h2>Создать команду</h2>
				</div>
				<CreateTeamForm/>
			</div>
		</main>
	);
};

export default Teams;