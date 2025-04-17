import { IPlayerSeasonProgress } from "@/models/player/IPlayerSeasonProgress";
import { useTableConfig } from "../../hooks/useTableConfig";

export const usePlayerSeasonProgressTable = () => {
    const tableId = 'player-season-progress-table';
    
    const tableConfig = useTableConfig<IPlayerSeasonProgress>(() => ({
        applyDelete: false,
        columns: [
            { key: 'player_name', title: 'Игрок', type: 'text' },
            { key: 'first_season_name', title: 'Первый сезон', type: 'text' },
            { key: 'first_season_avg_points', title: 'Среднее кол-во очков', type: 'text' },
            { key: 'second_season_name', title: 'Втооой сезон', type: 'text' },
            { key: 'second_season_avg_points', title: 'Среднее кол-во очков', type: 'text' },
            {
                key: 'points_diff',
                title: 'Разница в кол-ве очков',
                type: 'number',
                displayValue: (row) =>
                    row.points_diff !== undefined
                        ? `${row.points_diff > 0 ? '+' : ''}${row.points_diff}`
                        : '-'
            },
            {
                key: 'improvement_percentage',
                title: 'Прогресс',
                type: 'number',
                displayValue: (row) =>
                    row.improvement_percentage !== undefined
                        ? `${row.improvement_percentage > 0 ? '+' : ''}${row.improvement_percentage}%`
                        : '-'
            },
            { key: 'first_season_handicap', title: 'Гандикап первого сезона', type: 'text' },
            { key: 'second_season_handicap', title: 'Гандикап второго сезона', type: 'text' },
            {
                key: 'handicap_diff',
                title: 'Разница гандикапов',
                type: 'number',
                displayValue: (row) =>
                    row.handicap_diff !== undefined
                        ? `${row.handicap_diff > 0 ? '+' : ''}${row.handicap_diff}`
                        : '-'
            },
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