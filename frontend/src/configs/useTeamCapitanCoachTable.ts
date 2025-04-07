import { useTableConfig } from "../hooks/useTableConfig";
import useTableManager from "../hooks/useTableManager";
import { useCallback } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { ICoachTeam } from "@/models/ICoach";
import { ITeamCoachCaptainView } from "@/models/views/ITeamCoachCaptainView";
import { ITeam } from "@/models/ITeam";

export const useTeamCapitanCoachTable = () => {
    const tableId = 'team-coach-table';
    const { coachStore, teamStore } = useAppContext();
    
    const tableConfig = useTableConfig<ITeamCoachCaptainView>(() => ({
        applyDelete: true,
        columns: [
            { key: 'team_name', title: 'Команда', editable: true, type: 'text', maxLength: 150 },
            { key: 'captain_name', title: 'Капитан', type: 'text', maxLength: 50 },
            { key: 'coach_name', title: 'Тренер', type: 'text', maxLength: 50 },
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
    } = useTableManager<ITeamCoachCaptainView>();

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
                    teamStore.updateTeamName(changes as ITeam)
                ),
                ...Object.values(rowsToDelete).map((teamForDelete) =>
                    teamForDelete.team_id ? teamStore.deleteTeam(teamForDelete.team_id) : Promise.resolve()
                )
            ]);
            
			await teamStore.loadAllTeamsData();	
            resetTableState(tableId);
        } catch (error) {
            console.error("Ошибка при сохранении:", error);
            throw error;
        }
    }, [teamStore, getRowsToDelete, getRowsToEdit, resetTableState]);

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
