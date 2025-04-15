import { ITeamStatistic } from "@/models/team/ITeamStatistic";
import { useTableConfig } from "../../hooks/useTableConfig";

export const useTeamSeasonStatsTable = () => {
    const tableId = 'team-season-stats-table';
    
    const tableConfig = useTableConfig<ITeamStatistic>(() => ({
        applyDelete: false,
        columns: [
            { key: 'rank', title: 'Ранг', type: 'text' },
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