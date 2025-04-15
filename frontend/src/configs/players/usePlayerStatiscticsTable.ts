import { IPlayerStatistic } from "@/models/player/IPlayerStatistic";
import { useTableConfig } from "../../hooks/useTableConfig";

export const usePlayerStatiscticsTable = () => {
    const tableId = 'team-season-stats-table';
    
    const tableConfig = useTableConfig<IPlayerStatistic>(() => ({
        applyDelete: false,
        columns: [
            { key: 'player_name', title: 'Игрок', type: 'text' },
            { key: 'total_points', title: 'Число очков', type: 'text' },
            { key: 'average_points', title: 'Результативность', type: 'text' },
            { key: 'total_games', title: 'Сыграно игр', type: 'text' },
            { key: 'handicap', title: 'Гандикап', type: 'text' },
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