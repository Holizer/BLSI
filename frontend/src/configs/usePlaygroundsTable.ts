import { useTableConfig } from "../hooks/useTableConfig";
import useTableManager from "../hooks/useTableManager";
import { useCallback } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { IPlayground } from "@/models/playground/IPlayground";

export const usePlaygroundsTable = () => {
    const tableId = 'playgrounds-table';
    const { playgroundStore } = useAppContext();
    
    const tableConfig = useTableConfig<IPlayground>(() => ({
        applyDelete: true,
        columns: [
            { key: 'playground_name', title: 'Название', editable: true, type: 'text', maxLength: 150 },
            { key: 'capacity', title: 'Вместимость', editable: true, type: 'number', min: 0, max: 100000, maxLength: 5 },
            {
                key: 'playground_type_id',
                title: 'Тип игровой площадки', 
                editable: true,
                type: 'select',
                emptyValueText: 'Неизвестный тип',
                options: playgroundStore.playground_types.map((type) => ({
                    value: type.playground_type_id,
                    label: type.playground_type,
                })),
                displayValue: (rowData) => {
                    const type = playgroundStore.playground_types.find(t => t.playground_type_id === rowData.playground_type_id);
                    return type?.playground_type || 'Неизвестный тип';
                }
            }
        ],
    }));

    const {
        isEditing,
        handleTableChange,
        toggleDeleteRow,
        toggleEditMode,
        resetTableState,
        getRowsToDelete,
        getRowsToEdit,
    } = useTableManager<IPlayground>();

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
                    playgroundStore.updatePlayground(changes as IPlayground)
                ),
                ...Object.values(rowsToDelete).map((deleted) =>
                    deleted.playground_id ? playgroundStore.deletePlayground(deleted.playground_id) : Promise.resolve()
                )
            ]);
                        
            await playgroundStore.fetchPlaygroundTypes();
            await playgroundStore.fetchPlaygrounds();
            resetTableState(tableId);
        } catch (error) {
            console.error("Ошибка при сохранении:", error);
            throw error;
        }
    }, [playgroundStore, getRowsToDelete, getRowsToEdit, resetTableState]);

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
