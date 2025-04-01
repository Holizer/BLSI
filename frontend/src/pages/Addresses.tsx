import Search from '../UI/Search/Search';
import classes from './../styles/layout.module.scss';
import { observer } from 'mobx-react-lite';
import EditButton from '../UI/Edit/EditButton';
import useTableManager from '../hooks/useTableManager';
import Table from '../UI/Table/Table';
import { IPlayerTeamView } from '@/views/IPlayerTeamView';
import { TableColumn, TableConfig } from '@/types/table';
import { useContext } from 'react';
import { AppContext } from '../index';

const Addresses = () => {
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
		] as TableColumn<IPlayerTeamView>[],
	};
	
	
	const handleSave = async (tableId: string) => {
		try {
			const rowsToEdit = getRowsToEdit(tableId);
			const rowsToDelete = getRowsToDelete(tableId);

			if (Object.keys(rowsToEdit).length === 0 && Object.keys(rowsToDelete).length === 0) {
				resetTableState(tableId);
				return;
			}

			// await Promise.all(
			// 	Object.values(rowsToEdit).map(changes => 
			// 		playerStore.updatePlayerTeam(changes as IPlayerTeamView)
			// 	)
			// );

			// await Promise.all(
			// 	Object.values(rowsToDelete).map((playerForDelete) =>
			// 		playerForDelete.player_id ? playerStore.deletePlayer(playerForDelete.player_id) : Promise.resolve()
			// 	)
			// );
				
			// await fetchPlayerViewTeam();
			resetTableState(tableId);
		} catch (error) {
			console.error("Ошибка при сохранении:", error);
		}
	};

	return (
		<main className={classes.layout__container}>
			<div className={classes.content__block}>
				<div className={classes.block__header}>
					<h2>Адреса игроков</h2>
					<Search />
					<EditButton
						isEditing={!!isEditing['playerAddressTable']} 
						tableId="v"
						onEdit={toggleEditMode} 
						onCancel={() => toggleEditMode('playerAddressTable', false)}
						onSave={() => handleSave('playerAddressTable')}
					/>
				</div>
				<Table
					config={playerTeamViewConfig} 
					data={playerTeamView || []}
					tableId="playerTeamTable"
					isEditing={!!isEditing['playerAddressTable']}
					onToggleEdit={() => toggleEditMode('playerAddressTable')}
					onEditChange={(
						rowIndex: number, 
						updatedData: IPlayerTeamView
					) => handleTableChange('playerAddressTable', rowIndex, updatedData)}
					onDeleteToggle={(tableId, rowIndex, rowData) => 
						toggleDeleteRow(tableId, rowIndex, rowData)
					}
					rowsToDelete={getRowsToDelete('playerAddressTable')}
				/>
			</div>
		</main>
	);
};

export default observer(Addresses);