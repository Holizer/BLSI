import { useTableConfig } from "../hooks/useTableConfig";
import { ITeamSeasonStats } from "@/models/team/ITeamSeasonStats";

export const useTeamSeasonStatsTable = () => {
    const tableId = 'team-season-stats-table';
    
    const tableConfig = useTableConfig<ITeamSeasonStats>(() => ({
        applyDelete: false,
        columns: [
            { key: 'season_rank', title: 'Ранг', type: 'text' },
            { key: 'team_name', title: 'Команда', type: 'text' },
            { key: 'wins', title: 'Количество побед', type: 'text' },
            { key: 'losses', title: 'Количество поражений', type: 'text' },
            { key: 'draws', title: 'Количесвто ничеий', type: 'text' },
            { key: 'total_points', title: 'Набрано очков', type: 'text' },
            { key: 'win_percentage', title: 'Процент побед', type: 'text' },
        ],
    }));

    return {
        tableId,
        config: {
            columns: tableConfig.columns,
            applyDelete: tableConfig.applyDelete,
        },
        applyDelete: tableConfig.applyDelete,
    };
}