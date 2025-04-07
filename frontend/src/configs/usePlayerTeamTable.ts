import { useTableConfig } from "../hooks/useTableConfig";
import useTableManager from "../hooks/useTableManager";
import { useCallback } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { IPlayerTeamView } from "@/models/views/IPlayerTeamView";

export const usePlayerTeamTable = () => {
    const tableId = 'player-team-table';
    const { teamStore, playerStore } = useAppContext();
    
    const tableConfig = useTableConfig<IPlayerTeamView>(() => ({
        applyDelete: true,
        columns: [
            { key: 'first_name', title: 'Имя', editable: true, type: 'text', maxLength: 50 },
            { key: 'last_name', title: 'Фамилия', editable: true, type: 'text', maxLength: 50 },
            { key: 'age', title: 'Возраст', editable: true, type: 'number', min: 18, max: 99, maxLength: 2 },
            { key: 'phone', title: 'Номер телефона', editable: true, type: 'text', maxLength: 12  },
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
    } = useTableManager<IPlayerTeamView>();

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
					playerStore.updatePlayerTeam(changes as IPlayerTeamView)
				),
				...Object.values(rowsToDelete).map((playerForDelete) =>
					playerForDelete.player_id ? playerStore.deletePlayer(playerForDelete.player_id) : Promise.resolve()
				)
            ]);
		    await playerStore.fetchPlayerTeamView();
            resetTableState(tableId);
        } catch (error) {
            console.error("Ошибка при сохранении:", error);
            throw error;
        }
    }, [playerStore, getRowsToDelete, getRowsToEdit, resetTableState]);

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
