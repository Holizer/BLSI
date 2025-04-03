import Search from '../UI/Search/Search';
import classes from './../styles/layout.module.scss';
import { observer } from 'mobx-react-lite';
import EditButton from '../UI/Edit/EditButton';
import useTableManager from '../hooks/useTableManager';
import Table from '../UI/Table/Table';
import { TableColumn, TableConfig } from '@/types/table';
import { useContext, useEffect } from 'react';
import { AppContext } from '../index';
import { IPlayerAddressView } from '@/models/views/IPlayerAddressView';
import CreateCityForm from '../components/CreateForm/CreateCityForm';
import { ICity } from '../models/ICity';

const Addresses = () => {
	const { addressStore } = useContext(AppContext)
	const { playerAddresses } = addressStore
	
	const {
		isEditing,
		handleTableChange,
		toggleDeleteRow,
		toggleEditMode,
		resetTableState,
		getRowsToDelete,
		getRowsToEdit
	} = useTableManager<IPlayerAddressView>();

	const playerTeamViewConfig: TableConfig<IPlayerAddressView> = {
		applyDelete: true,
		columns: [
			{ key: 'first_name', title: 'Имя', editable: true, type: 'text', maxLength: 50 },
			{ key: 'last_name', title: 'Фамилия', editable: true, type: 'text', maxLength: 50 },
			{
				key: 'city_id',
				title: 'Город',
				editable: true,
				type: 'select',
				emptyValueText: 'Сайлент Хилл',
				options: addressStore.cities.map((city) => ({
					value: city.city_id,
					label: city.city_name,
				})),
				displayValue: (rowData) => {
					if (rowData.city_id == null) {
						return 'Сайлент Хилл';
					}
					const city = addressStore.cities.find(t => t.city_id === rowData.city_id);
					return city?.city_name || 'Сайлент Хилл';
				}
			},
			{ key: 'street', title: 'Улица', editable: true, type: 'text', maxLength: 150 },
			{ key: 'house_number', title: 'Номер дома', editable: true, type: 'number', min: 18, max: 99, maxLength: 4 },
			{ key: 'postal_code', title: 'Почтовый индекс', editable: true, type: 'number', min: 0, max: 10000, maxLength: 4 },

		] as TableColumn<IPlayerAddressView>[],
	};

	const cityTableConfig: TableConfig<ICity> = {
		applyDelete: true,
		columns: [
			{ key: 'city_name', title: 'Город', editable: true, type: 'text' },
		] as TableColumn<ICity>[],
	};
	
	const loadAllAddressesData = async () => {
		await addressStore.loadAllAddressesData();		
	}
	
	useEffect(() => {
		loadAllAddressesData();
	}, [])

	const handlePlayerAddressTableSave = async (tableId: string) => {
		try {
			const rowsToEdit = getRowsToEdit(tableId);
			const rowsToDelete = getRowsToDelete(tableId);

			if (Object.keys(rowsToEdit).length === 0 && Object.keys(rowsToDelete).length === 0) {
				resetTableState(tableId);
				return;
			}

			await Promise.all(
				Object.values(rowsToEdit).map(changes => 
					addressStore.updatePlayerAddress(changes as IPlayerAddressView)
				)
			);

			await Promise.all(
				Object.values(rowsToDelete).map((deleted) =>
					deleted.player_id ? addressStore.deletePlayerAddress(deleted.player_id) : Promise.resolve()
				)
			);
				
			await loadAllAddressesData();
			resetTableState(tableId);
		} catch (error) {
			console.error("Ошибка при сохранении:", error);
		}
	};

	const handleCityTableSave = async (tableId: string) => {
		try {
			const rowsToEdit = getRowsToEdit(tableId);
			const rowsToDelete = getRowsToDelete(tableId);

			if (Object.keys(rowsToEdit).length === 0 && Object.keys(rowsToDelete).length === 0) {
				resetTableState(tableId);
				return;
			}

			await Promise.all(
				Object.values(rowsToEdit).map(changes => 
					addressStore.updateCityName(changes as ICity)
				)
			);

			await Promise.all(
				Object.values(rowsToDelete).map((deleted) =>
					deleted.city_id ? addressStore.deleteCity(deleted.city_id) : Promise.resolve()
				)
			);
				
			await loadAllAddressesData();
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
						tableId="playerAddressTable"
						onEdit={toggleEditMode} 
						onCancel={() => toggleEditMode('playerAddressTable', false)}
						onSave={() => handlePlayerAddressTableSave('playerAddressTable')}
					/>
				</div>
				<Table
					config={playerTeamViewConfig} 
					data={playerAddresses || []}
					tableId="playerTeamTable"
					isEditing={!!isEditing['playerAddressTable']}
					onToggleEdit={() => toggleEditMode('playerAddressTable')}
					onEditChange={(
						rowIndex: number, 
						updatedData: IPlayerAddressView
					) => handleTableChange('playerAddressTable', rowIndex, updatedData)}
					onDeleteToggle={(tableId, rowIndex, rowData) => 
						toggleDeleteRow(tableId, rowIndex, rowData)
					}
					rowsToDelete={getRowsToDelete('playerAddressTable')}
				/>
			</div>

			<div className={classes.content__block}>
				<div className={classes.block__header}>
					<h2>Города</h2>
					<Search />
					<EditButton
						isEditing={!!isEditing['citiesTabel']} 
						tableId="citiesTabel"
						onEdit={toggleEditMode} 
						onCancel={() => toggleEditMode('citiesTabel', false)}
						onSave={() => handleCityTableSave('citiesTabel')}
					/>
				</div>
				<Table
					config={cityTableConfig} 
					data={addressStore.cities || []}
					tableId="citiesTabel"
					isEditing={!!isEditing['citiesTabel']}
					onToggleEdit={() => toggleEditMode('citiesTabel')}
					onEditChange={(
						rowIndex: number, 
						updatedData: ICity
					) => handleTableChange('citiesTabel', rowIndex, updatedData)}
					onDeleteToggle={(tableId, rowIndex, rowData) => 
						toggleDeleteRow(tableId, rowIndex, rowData)
					}
					rowsToDelete={getRowsToDelete('citiesTabel')}
				/>
			</div>
			<CreateCityForm/>
		</main>
	);
};

export default observer(Addresses);