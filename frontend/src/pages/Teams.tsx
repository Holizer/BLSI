import { useContext, useEffect, useState } from 'react';
import classes from './../styles/layout.module.scss';
import { TableColumn, TableConfig } from '@/types/table';
import { ITeamCoachCaptainView } from '../models/views/ITeamCoachCaptainView';
import { AppContext } from '../index';
import Search from '../UI/Search/Search';
import EditButton from '../UI/Edit/EditButton';
import Table from '../UI/Table/Table';
import CreateTeamForm from '../components/CreateForm/CreateTeamForm';
import useTableManager from '../hooks/useTableManager';
import { ICoachTeam } from '@/models/ICoach';
import { ITeam } from '@/models/ITeam';
import { observer } from 'mobx-react-lite';
 
const Teams = () => {
	const { teamStore, coachStore } = useContext(AppContext)
	const { teamsDetailed } = teamStore;
	
	//#region TablesConfiguration
	const {
		isEditing: isTeamsEditing,
		handleTableChange: handleTeamsTableChange,
		toggleDeleteRow: toggleTeamsDeleteRow,
		toggleEditMode: toggleTeamsEditMode,
		resetTableState: resetTeamsTableState,
		getRowsToDelete: getTeamsRowsToDelete,
		getRowsToEdit: getTeamsRowsToEdit
	} = useTableManager<ITeamCoachCaptainView>();
	 
	 const {
		isEditing: isCoachesEditing,
		handleTableChange: handleCoachesTableChange,
		toggleDeleteRow: toggleCoachesDeleteRow,
		toggleEditMode: toggleCoachesEditMode,
		resetTableState: resetCoachesTableState,
		getRowsToDelete: getCoachesRowsToDelete,
		getRowsToEdit: getCoachesRowsToEdit
	} = useTableManager<ICoachTeam>();

	const teamCoachCaptainViewConfig: TableConfig<ITeamCoachCaptainView> = {
		applyDelete: true,
		columns: [
			{ key: 'team_name', title: 'Команда', editable: true, type: 'text', maxLength: 150 },
			{ key: 'captain_name', title: 'Капитан', type: 'text', maxLength: 50 },
			{ key: 'coach_name', title: 'Тренер', type: 'text', maxLength: 50 },
		] as TableColumn<ITeamCoachCaptainView>[],
	};

	const { coachces } = coachStore;
	const teamCoachTableConfig: TableConfig<ICoachTeam> = {
		applyDelete: true,
		columns: [
			{ key: 'first_name', title: 'Имя', editable: true, type: 'text', maxLength: 50 },
			{ key: 'last_name', title: 'Фамилия', editable: true, type: 'text', maxLength: 50 },
			{
				key: 'team_id',
				title: 'Команда',
				editable: true,
				type: 'select',
				emptyValueText: 'Без команды',
				options: teamStore.teams.map((team) => ({
					value: team.team_id,
					label: team.team_name,
				})),
				displayValue: (rowData) => {
					if (rowData.team_id == null) {
						return 'Без команды';
					}
					const team = teamStore.teams.find(t => t.team_id === rowData.team_id);
					return team?.team_name || 'Без команды';
				}
			}
		] as TableColumn<ICoachTeam>[],
	};
	//#endregion

	const fetchTeamsWithCatainAndCoach = async () => {
		await teamStore.loadAllTeamsData();	
	}

	useEffect(() => {
		fetchTeamsWithCatainAndCoach();
	}, [teamStore])
	

	//#region handleSave
	const handleSaveTeamsTable = async (tableId: string) => {
		try {
			const rowsToEdit = getTeamsRowsToEdit(tableId);
			const rowsToDelete = getTeamsRowsToDelete(tableId);

			if (Object.keys(rowsToEdit).length === 0 && Object.keys(rowsToDelete).length === 0) {
				resetTeamsTableState(tableId);
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

			await teamStore.loadAllTeamsData();	
			resetTeamsTableState(tableId);
		} catch (error) {
		  	console.error("Ошибка при сохранении:", error);
		}
	};

	const handleSaveCoachTeamsTable = async (tableId: string) => {
		try {
			const rowsToEdit = getCoachesRowsToEdit(tableId);
			const rowsToDelete = getCoachesRowsToDelete(tableId);

			if (Object.keys(rowsToEdit).length === 0 && Object.keys(rowsToDelete).length === 0) {
				resetCoachesTableState(tableId);
				return;
			}

			await Promise.all(
				Object.values(rowsToEdit).map(changes => 
					coachStore.updateCoach(changes as ICoachTeam)
				)
			);

			await Promise.all(
				Object.values(rowsToDelete).map((deleted) =>
					deleted.coach_id ? coachStore.deleteCoach(deleted.coach_id) : Promise.resolve()
				)
			);

			await coachStore.fetchCoaches();
			resetCoachesTableState(tableId);
		} catch (error) {
		  	console.error("Ошибка при сохранении:", error);
		}
	};
	//#endregion
	
	return (
		<main className={classes.layout__container}>
			<div className={classes.content__block}>
				<div className={classes.block__header}>
					<h2>Список команд</h2>
					<Search />
					<EditButton
						isEditing={!!isTeamsEditing['teamsTable']} 
						tableId="teamsTable"
						onEdit={toggleTeamsEditMode} 
						onCancel={() => toggleTeamsEditMode('teamsTable', false)}
						onSave={() => handleSaveTeamsTable('teamsTable')}
					/>
				</div>
				<Table 
					config={teamCoachCaptainViewConfig} 
					data={teamsDetailed || []}
					tableId="teamsTable"
					isEditing={!!isTeamsEditing['teamsTable']}
					onToggleEdit={() => toggleTeamsEditMode('teamsTable')}
					onEditChange={(
						rowIndex: number, 
						updatedData: ITeamCoachCaptainView
					) => handleTeamsTableChange('teamsTable', rowIndex, updatedData)}
					onDeleteToggle={(tableId, rowIndex, rowData) => 
						toggleTeamsDeleteRow(tableId, rowIndex, rowData)
					}
					rowsToDelete={getTeamsRowsToDelete('teamsTable')}
				/>
			</div>
			<CreateTeamForm/>

			<div className={classes.content__block}>
				<div className={classes.block__header}>
					<h2>Список тренеров</h2>
					<Search />
					<EditButton
						isEditing={!!isCoachesEditing['coachTeamsTable']} 
						tableId="coachTeamsTable"
						onEdit={toggleCoachesEditMode} 
						onCancel={() => toggleCoachesEditMode('coachTeamsTable', false)}
						onSave={() => handleSaveCoachTeamsTable('coachTeamsTable')}
					/>
				</div>
				<Table 
					config={teamCoachTableConfig} 
					data={coachces || []}
					tableId="coachTeamsTable"
					isEditing={!!isCoachesEditing['coachTeamsTable']}
					onToggleEdit={() => toggleCoachesEditMode('coachTeamsTable')}
					onEditChange={(
						rowIndex: number, 
						updatedData: ICoachTeam
					) => handleCoachesTableChange('coachTeamsTable', rowIndex, updatedData)}
					onDeleteToggle={(tableId, rowIndex, rowData) => 
						toggleCoachesDeleteRow(tableId, rowIndex, rowData)
					}
					rowsToDelete={getCoachesRowsToDelete('coachTeamsTable')}
				/>
			</div>
		</main>
	);
};

export default observer(Teams);