import { useContext, useEffect, useState } from 'react';
import classes from './../styles/layout.module.scss';
import { TableColumn, TableConfig } from '@/types/table';
import { ITeamCoachCaptainView } from '../models/views/ITeamCoachCaptainView';
import { AppContext } from '../index';
import Search from '../UI/Search/Search';
import EditButton from '../UI/Edit/EditButton';
import Table from '../UI/Table/Table';
import CreateTeamForm from '../components/CreateForm/CreateTeamForm';
import { ITeam } from '@/models/ITeam';
import useTableManager from '../hooks/useTableManager';
import { observer } from 'mobx-react-lite';

const Teams = () => {
	const { teamStore } = useContext(AppContext)
	const { teamsDetailed } = teamStore;
	const {
		isEditing,
		handleTableChange,
		toggleDeleteRow,
		toggleEditMode,
		resetTableState,
		getRowsToDelete,
		getRowsToEdit
	} = useTableManager<ITeamCoachCaptainView>();

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

	//#region FETCH DATA
	const fetchTeamsWithCatainAndCoach = async () => {
		await teamStore.loadAllTeamsData();	
	}

	useEffect(() => {
		fetchTeamsWithCatainAndCoach();
	}, [teamStore])
	//#endregion

	const handleSave = async (tableId: string) => {
		try {
			const rowsToEdit = getRowsToEdit(tableId);
			const rowsToDelete = getRowsToDelete(tableId);

			if (Object.keys(rowsToEdit).length === 0 && Object.keys(rowsToDelete).length === 0) {
				resetTableState(tableId);
				return;
			}

			await Promise.all(
				Object.values(rowsToEdit).map(changes => 
					teamStore.updateTeamName(changes as ITeam)
				)
			);

			await Promise.all(
				Object.values(rowsToDelete).map((teamForDelete) =>
				    teamForDelete.team_id ? teamStore.deleteTeam(teamForDelete.team_id) : Promise.resolve()
				)
			);
			 
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
					data={teamsDetailed || []}
					tableId="teamsTable"
					isEditing={!!isEditing['teamsTable']}
					onToggleEdit={() => toggleEditMode('teamsTable')}
					onEditChange={(
						rowIndex: number, 
						updatedData: ITeamCoachCaptainView
					) => handleTableChange('teamsTable', rowIndex, updatedData)}
					onDeleteToggle={(tableId, rowIndex, rowData) => 
						toggleDeleteRow(tableId, rowIndex, rowData)
					}
					rowsToDelete={getRowsToDelete('teamsTable')}
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

export default observer(Teams);