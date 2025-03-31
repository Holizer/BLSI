import Search from '../UI/Search/Search';
import classes from './../styles/layout.module.scss'
import EditButton from '../UI/Edit/EditButton';
import { useContext, useEffect, useState } from 'react';
import Table from '../UI/Table/Table';
import { IPlayerTeamView } from '@/views/IPlayerTeamView';
import { TableColumn, TableConfig } from '@/types/table';
import { AppContext } from '..';
import useTableManager from '../hooks/useTableManager';

const PlayersManager: React.FC = () => {
	const { playerStore, teamStore } = useContext(AppContext)
	const [playerTeamView, setPlayerTeamView] = useState<IPlayerTeamView[] | undefined>();

	const {
		editedRows,
		rowsToDelete,
		isEditing,
		handleTableChange,
		toggleEditMode,
		handleDeleteRow,
		resetTableState
	} = useTableManager<IPlayerTeamView>();

	const playerTeamViewConfig: TableConfig<IPlayerTeamView> = {
		applyDelete: true,
		columns: [
			{ key: 'first_name', title: 'Имя', editable: true, type: 'text' },
			{ key: 'last_name', title: 'Фамилия', editable: true, type: 'text' },
			{
				key: 'team_id',
				title: 'Команда',
				editable: true,
				type: 'select',
				options: teamStore.teams.map((team) => ({
				  value: team.team_id,
				  label: team.team_name,
				})),
				displayValue: (rowData) => {
					const team = teamStore.teams.find(t => t.team_id === rowData.team_id);
					return team ? team.team_name : '';
				}
			},
		] as TableColumn<IPlayerTeamView>[],
	};

	const fetchPlayerViewTeam = async () => {
		await playerStore.fetchPlayerTeamView();		
		setPlayerTeamView(playerStore.playerTeamView)
	}

	useEffect(() => {
		fetchPlayerViewTeam();
	}, [])

	const handleSave = async (tableId: string, state?: boolean) => {
		const tableEditedRows = editedRows[tableId] || {};
		
		if(Object.keys(tableEditedRows).length === 0) {
			toggleEditMode(tableId, false)
			return;
		}

		const changesWithFullData = Object.entries(tableEditedRows).map(([rowIndex, changes]) => {
			return {
				rowIndex: Number(rowIndex),
				changes: changes as IPlayerTeamView,
			};
		});
		
		try {
			await Promise.all(
				changesWithFullData.map(({ changes }) => 
					playerStore.updatePlayerTeam(changes)
				)
			);
		 
			await fetchPlayerViewTeam();
			resetTableState(tableId);
		} catch (error) {
			console.error("Ошибка при сохранении игроков:", error);
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
						onSave={() => handleSave('playerTeamTable', false)}
					/>
				</div>
				<Table 
					config={playerTeamViewConfig} 
					data={playerTeamView || []}
					isEditing={!!isEditing['playerTeamTable']}
					onToggleEdit={() => toggleEditMode('playerTeamTable')}
					onEditChange={(
						rowIndex: number, 
						updatedData: IPlayerTeamView
					) => handleTableChange('playerTeamTable', rowIndex, updatedData)}
					tableId="playerTeamTable"
				/>
			</div>
		</main>
	);
};

export default PlayersManager;
