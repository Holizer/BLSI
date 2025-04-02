import Search from '../UI/Search/Search';
import classes from './../styles/layout.module.scss'
import EditButton from '../UI/Edit/EditButton';
import { useContext, useEffect, useState } from 'react';
import Table from '../UI/Table/Table';
import { IPlayerTeamView } from '@/models/views/IPlayerTeamView';
import { TableColumn, TableConfig } from '@/types/table';
import { AppContext } from '..';
import useTableManager from '../hooks/useTableManager';
import { observer } from 'mobx-react-lite';
import CreatePlayerForm from '../components/CreateForm/CreatePlayerForm';

const PlayersManager: React.FC = () => {
	const { playerStore, teamStore } = useContext(AppContext)
	const { playerTeamView } = playerStore

	const {
		isEditing,
		handleTableChange,
		toggleDeleteRow,
		toggleEditMode,
		resetTableState,
		getRowsToDelete,
		getRowsToEdit
	} = useTableManager<IPlayerTeamView>();

	const playerTeamViewConfig: TableConfig<IPlayerTeamView> = {
		applyDelete: true,
		columns: [
			{ key: 'first_name', title: 'Имя', editable: true, type: 'text' },
			{ key: 'last_name', title: 'Фамилия', editable: true, type: 'text' },
			{ key: 'age', title: 'Возраст', editable: true, type: 'number', min: 18, max: 99 },
			{ key: 'phone', title: 'Номер телефона', editable: true, type: 'text', maxLength: 12  },
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
		] as TableColumn<IPlayerTeamView>[],
	};

	const fetchPlayerViewTeam = async () => {
		await playerStore.fetchPlayerTeamView();
	}

	useEffect(() => {
		fetchPlayerViewTeam();
	}, [])

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
					playerStore.updatePlayerTeam(changes as IPlayerTeamView)
				)
			);

			await Promise.all(
				Object.values(rowsToDelete).map((playerForDelete) =>
					playerForDelete.player_id ? playerStore.deletePlayer(playerForDelete.player_id) : Promise.resolve()
				)
			);
				
			await fetchPlayerViewTeam();
			resetTableState(tableId);
		} catch (error) {
			console.error("Ошибка при сохранении:", error);
		}
	};

	return (
		<main className={classes.layout__container}>
			<div className={classes.content__block}>
				<div className={classes.block__header}>
					<h2>Список игроков</h2>
					<Search />
					<EditButton
						isEditing={!!isEditing['playerTeamTable']} 
						tableId="playerTeamTable"
						onEdit={toggleEditMode} 
						onCancel={() => toggleEditMode('playerTeamTable', false)}
						onSave={() => handleSave('playerTeamTable')}
					/>
				</div>
				<Table
					config={playerTeamViewConfig} 
					data={playerTeamView || []}
					tableId="playerTeamTable"
					isEditing={!!isEditing['playerTeamTable']}
					onToggleEdit={() => toggleEditMode('playerTeamTable')}
					onEditChange={(
						rowIndex: number, 
						updatedData: IPlayerTeamView
					) => handleTableChange('playerTeamTable', rowIndex, updatedData)}
					onDeleteToggle={(tableId, rowIndex, rowData) => 
						toggleDeleteRow(tableId, rowIndex, rowData)
					}
					rowsToDelete={getRowsToDelete('playerTeamTable')}
				/>
			</div>
			<CreatePlayerForm/>
		</main>
	);
};

export default observer(PlayersManager);
