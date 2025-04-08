import { useTableConfig } from "../hooks/useTableConfig";
import useTableManager from "../hooks/useTableManager";
import { useCallback } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { IScheduledMatch } from "../models/views/IScheduledMatch";

export const useScheduledMatchesTable = () => {
    const tableId = 'scheduled-matches-table';
    const { matchStore } = useAppContext();
    
    const tableConfig = useTableConfig<IScheduledMatch>(() => ({
        applyDelete: false,
        columns: [
            { key: 'team1', title: 'Команда 1', type: 'text' },
            { key: 'team2', title: 'Команда 2', type: 'text' },
            { key: 'event_date', title: 'Дата проведения', type: 'text' },
            { key: 'event_time', title: 'Время проведения', type: 'text' },
            { key: 'playground_name', title: 'Игровая площадка', type: 'text' },
            { key: 'season_name', title: 'Сезон', type: 'text' },
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
    } = useTableManager<IScheduledMatch>();

    const handleSave = useCallback(async (tableId: string) => {
        try {
            const rowsToEdit = getRowsToEdit(tableId);
            const rowsToDelete = getRowsToDelete(tableId);

            if (Object.keys(rowsToEdit).length === 0 && Object.keys(rowsToDelete).length === 0) {
                resetTableState(tableId);
                return;
            }

            // Implement your save logic here
            // For example:
            // await Promise.all([
            //     ...Object.values(rowsToEdit).map(changes => 
            //         matchStore.updateMatch(changes)
            //     ),
            //     ...Object.values(rowsToDelete).map((deleted) =>
            //         deleted.match_id ? matchStore.deleteMatch(deleted.match_id) : Promise.resolve()
            //     )
            // ]);
            
            // await matchStore.fetchScheduledMatches();
            resetTableState(tableId);
        } catch (error) {
            console.error("Ошибка при сохранении:", error);
            throw error;
        }
    }, [matchStore, getRowsToDelete, getRowsToEdit, resetTableState]);

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