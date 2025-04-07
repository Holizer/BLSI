import { ICity } from "../models/ICity";
import { useTableConfig } from "../hooks/useTableConfig";
import useTableManager from "../hooks/useTableManager";
import { useCallback } from "react";
import { useAppContext } from "../hooks/useAppContext";

export const useCityTable = () => {
    const tableId = 'city-table';
    const { addressStore } = useAppContext();
    
    const tableConfig = useTableConfig<ICity>(() => ({
        applyDelete: true,
        columns: [
            { key: 'city_name', title: 'Город', editable: true, type: 'text' },
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
    } = useTableManager<ICity>();

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
                    addressStore.updateCityName(changes as ICity)
                ),
                ...Object.values(rowsToDelete).map((deleted) =>
                deleted.city_id 
                    ? addressStore.deleteCity(deleted.city_id) 
                    : Promise.resolve()
                )
            ]);
            
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
