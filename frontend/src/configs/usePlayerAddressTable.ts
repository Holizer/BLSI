import { useTableConfig } from "../hooks/useTableConfig";
import useTableManager from "../hooks/useTableManager";
import { useCallback } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { IPlayerAddressView } from "@/models/views/IPlayerAddressView";

export const usePlayerAddressTable = () => {
    const tableId = 'player-address-table';
    const { addressStore } = useAppContext();
    
    const tableConfig = useTableConfig<IPlayerAddressView>(() => ({
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
        ]
    }));

    const {
        isEditing,
        handleTableChange,
        toggleDeleteRow,
        toggleEditMode,
        resetTableState,
        getRowsToDelete,
        getRowsToEdit,
    } = useTableManager<IPlayerAddressView>();

    const handleSave = useCallback(async (tableId: string) => {
        try {
            const rowsToEdit = getRowsToEdit(tableId);
            const rowsToDelete = getRowsToDelete(tableId);

            if (Object.keys(rowsToEdit).length === 0 && Object.keys(rowsToDelete).length === 0) {
				resetTableState(tableId);
				return;
			}

			await Promise.all([
				...Object.values(rowsToEdit).map(changes => 
					addressStore.updatePlayerAddress(changes as IPlayerAddressView)
				),
				...Object.values(rowsToDelete).map((deleted) =>
					deleted.player_id ? addressStore.deletePlayerAddress(deleted.player_id) : Promise.resolve()
				)
			])
				
			await addressStore.loadAllAddressesData();
            resetTableState(tableId);
        } catch (error) {
            console.error("Ошибка при сохранении:", error);
            throw error;
        }
    }, [addressStore, getRowsToDelete, getRowsToEdit, resetTableState]);

    return {
        tableId,
        config: {
            columns: tableConfig.columns,
            applyDelete: tableConfig.applyDelete,
        },
        isEditing,
        handleTableChange,
        toggleDeleteRow,
        toggleEditMode,
        resetTableState,
        getRowsToDelete,
        getRowsToEdit,
        handleSave,
        applyDelete: tableConfig.applyDelete,
    };
}
