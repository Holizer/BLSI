import { useTableConfig } from "../hooks/useTableConfig";
import useTableManager from "../hooks/useTableManager";
import { useCallback } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { IPlaygroundType } from "@/models/playground/IPlaygroundType";

export const usePlaygroundsTypeTable = () => {
    const tableId = 'playgrounds-type-table';
    const { playgroundStore } = useAppContext();
    
    const tableConfig = useTableConfig<IPlaygroundType>(() => ({
        applyDelete: true,
        columns: [
            { key: 'playground_type', title: 'Тип игровой площадки', editable: true, type: 'text' },
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
    } = useTableManager<IPlaygroundType>();

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
                    playgroundStore.updatePlaygroundType(changes as IPlaygroundType)
                ),
                ...Object.values(rowsToDelete).map((deleted) =>
                    deleted.playground_type_id ? playgroundStore.deletePlaygroundType(deleted.playground_type_id) : Promise.resolve()
                )
            ]);
                        
            await playgroundStore.fetchPlaygroundTypes();
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
