import { useTableConfig } from "../hooks/useTableConfig";
import useTableManager from "../hooks/useTableManager";
import { useCallback } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { ICoachTeam } from "@/models/ICoach";

export const useTeamCoachTable = () => {
    const tableId = 'team-coach-table';
    const { teamStore, coachStore } = useAppContext();
    
    const tableConfig = useTableConfig<ICoachTeam>(() => ({
        applyDelete: true,
        columns: [
            { key: 'first_name', title: 'Имя', editable: true, type: 'text', maxLength: 50 },
            { key: 'last_name', title: 'Фамилия', editable: true, type: 'text', maxLength: 50 },
            {
                key: 'team_id',
                title: 'Команда',
                editable: true,
                type: 'select',
                emptyValueText: 'Без команды',
                options: teamStore.teams.map((team) => ({
                    value: team.team_id,
                    label: team.team_name,
                })),
                displayValue: (rowData) => {
                    if (rowData.team_id == null) {
                        return 'Без команды';
                    }
                    const team = teamStore.teams.find(t => t.team_id === rowData.team_id);
                    return team?.team_name || 'Без команды';
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
    } = useTableManager<ICoachTeam>();

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
					coachStore.updateCoach(changes as ICoachTeam)
				),
				...Object.values(rowsToDelete).map((deleted) =>
					deleted.coach_id ? coachStore.deleteCoach(deleted.coach_id) : Promise.resolve()
				)
            ]);
            
            await coachStore.fetchCoaches();
            resetTableState(tableId);
        } catch (error) {
            console.error("Ошибка при сохранении:", error);
            throw error;
        }
    }, [coachStore, getRowsToDelete, getRowsToEdit, resetTableState]);

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
