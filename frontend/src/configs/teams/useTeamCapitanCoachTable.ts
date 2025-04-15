import { useTableConfig } from "../../hooks/useTableConfig";
import useTableManager from "../../hooks/useTableManager";
import { useCallback } from "react";
import { useAppContext } from "../../hooks/useAppContext";
import { ITeamCoachCaptainView } from "@/models/teamCoachCapitan/ITeamCoachCaptainView";
import { ITeam } from "@/models/team/ITeam";

export const useTeamCapitanCoachTable = () => {
    const tableId = 'team-coach-table';
    const { teamStore, playerStore, coachStore } = useAppContext();
    const { playerTeams } = playerStore
    const { coaches } = coachStore


    const tableConfig = useTableConfig<ITeamCoachCaptainView>(() => ({
        applyDelete: true,
        columns: [
            { key: 'team_name', title: 'Команда', editable: true, type: 'text', maxLength: 150 },
            {
                key: 'captain_id',
                title: 'Капитан',
                editable: true,
                type: 'select',
                emptyValueText: 'Отсутсвует',
                options: (rowData: ITeamCoachCaptainView) => {
                    const playersForTeam = playerTeams.filter(p => p.team_id === rowData.team_id);
                    return playersForTeam.map(player => ({
                        value: player.player_id,
                        label: `${player.first_name} ${player.last_name}`,
                    }));
                },
                displayValue: (rowData) => {
                    const player = playerTeams.find(p => p.player_id === rowData.captain_id);
                    return player ? `${player.first_name} ${player.last_name}` : 'Отсутствует';
                }
            },
            {
                key: 'coach_id',
                title: 'Тренер',
                editable: true,
                type: 'select',
                emptyValueText: 'Отсутсвует',
                options: coaches.map((coach) => ({
                    value: coach.coach_id,
                    label: `${coach.first_name} ${coach.last_name}`,
                })),
                displayValue: (rowData) => {
                    if (rowData.coach_id == null) {
                        return 'Отсутсвует';
                    }
                    const coach = coaches.find(co => co.coach_id === rowData.coach_id);
                    return `${coach?.first_name} ${coach?.last_name}` || 'Отсутсвует';
                }
            }
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
                    teamStore.updateTeam(changes as ITeam)
                ),
                ...Object.values(rowsToDelete).map((teamForDelete) =>
                    teamForDelete.team_id ? teamStore.deleteTeam(teamForDelete.team_id) : Promise.resolve()
                )
            ]);
            
			await teamStore.loadAllTeamsData();	
			await coachStore.fetchCoaches();	
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
