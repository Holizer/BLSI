import { useTableConfig } from "../../hooks/useTableConfig";
import useTableManager from "../../hooks/useTableManager";
import { useCallback } from "react";
import { useAppContext } from "../../hooks/useAppContext";
import { ISeasonWithWeeks } from "@/models/season/ISeasonWithWeeks";

export const useSeasonTable = () => {
    const tableId = 'season-table';
    const { seasonStore } = useAppContext();
    
    const tableConfig = useTableConfig<ISeasonWithWeeks>(() => ({
        applyDelete: true,
        columns: [
            { key: 'season_name', title: 'Название сезона', editable: true, type: 'text', maxLength: 150 },
            { key: 'season_start', title: 'Начало сезона', editable: true, type: 'date', maxLength: 150 },
            { key: 'season_end', title: 'Конец сезона', editable: true, type: 'date', maxLength: 150 },
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
    } = useTableManager<ISeasonWithWeeks>();

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
                    seasonStore.updateSeason(changes as ISeasonWithWeeks)
                ),
                ...Object.values(rowsToDelete).map((deleted) =>
                    deleted.season_id ? seasonStore.deleteSeason(deleted.season_id) : Promise.resolve()
                )
            ]);
                        
            await seasonStore.fetchSeasonWithWeeks();
            resetTableState(tableId);
        } catch (error) {
            console.error("Ошибка при сохранении:", error);
            throw error;
        }
    }, [seasonStore, getRowsToDelete, getRowsToEdit, resetTableState]);

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
