import { useContext, useEffect, useState } from 'react';
import classes from './../styles/layout.module.scss';
import { TableColumn, TableConfig } from '@/types/table';
import { ITeamCoachCaptainView } from '../views/ITeamCoachCaptainView';
import { AppContext } from '../index';
import Search from '../UI/Search/Search';
import EditButton from '../UI/Edit/EditButton';
import Table from '../UI/Table/Table';
import CreateTeamForm from '../components/CreateTeamForm/CreateTeamForm';
import { ITeam } from '@/models/ITeam';
import useTableManager from '../hooks/useTableManager';

//#region TablesConfig
const teamCoachCaptainViewConfig: TableConfig<ITeamCoachCaptainView> = {
	applyDelete: true,
	columns: [
		{ key: 'team_name', title: 'Команда', editable: true, type: 'text' },
		{ key: 'captain_name', title: 'Капитан', type: 'text' },
		{ key: 'coach_name', title: 'Тренер', type: 'text' },
	] as TableColumn<ITeamCoachCaptainView>[],
};
//#endregion

const Teams = () => {
	const { teamStore } = useContext(AppContext)
	const [teamsView, setTeamsView] = useState<ITeamCoachCaptainView[] | undefined>();
	
	const {
		editedRows,
		rowsToDelete,
		isEditing,
		handleTableChange,
		toggleEditMode,
		handleDeleteRow,
		resetTableState
	} = useTableManager<ITeamCoachCaptainView>();

	//#region FETCH DATA
	const fetchTeamsWithCatainAndCoach = async () => {
		await teamStore.fetchTeamsWithCatainAndCoach();	
		setTeamsView(teamStore.teamsView)
	}

	useEffect(() => {
		fetchTeamsWithCatainAndCoach();
	}, [])
	//#endregion


	const handleSave = async (tableId: string) => {
		try {
			const tableEditedData = editedRows[tableId] || {};
			
			if (Object.keys(tableEditedData).length > 0) {
				await Promise.all(
					Object.entries(tableEditedData).map(([_, changes]) => 
						teamStore.updateTeamName(changes as ITeam)
					)
				);
		  	}
	 
			// if (rowsToDelete.length > 0) {
			// 	await Promise.all(
			// 		rowsToDelete.map(rowIndex => 
			// 		   teamStore.deleteTeam(teamsView[rowIndex].team_id)
			// 		)
			// 	);
			// }
	 
			await fetchTeamsWithCatainAndCoach();
			resetTableState(tableId);
		} catch (error) {
		  	console.error("Ошибка при сохранении:", error);
		}
	};
	
	return (
		<main className={classes.layout__container}>
			<div className={classes.content__block}>
				<div className={classes.block__header}>
					<h2>Список команд</h2>
					<Search />
					<EditButton
						isEditing={!!isEditing['teamsTable']} 
						tableId="teamsTable"
						onEdit={toggleEditMode} 
						onCancel={() => toggleEditMode('teamsTable', false)}
						onSave={() => handleSave('teamsTable')}
					/>
				</div>
				<Table 
					config={teamCoachCaptainViewConfig} 
					data={teamsView || []}
					isEditing={!!isEditing['teamsTable']}
					onToggleEdit={() => toggleEditMode('teamsTable')}
					onEditChange={(
						rowIndex: number, 
						updatedData: ITeamCoachCaptainView
					 ) => handleTableChange('teamsTable', rowIndex, updatedData)}
					tableId="teamsTable"
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