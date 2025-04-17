import { useTableConfig } from "../../hooks/useTableConfig";
import { ITeamSeasonProgress } from "@/models/team/ITeamSeasonProgress";

export const useTeamSeasonProgressTable = () => {
    const tableId = 'team-season-progress-table';

    const tableConfig = useTableConfig<ITeamSeasonProgress>(() => ({
        applyDelete: false,
        columns: [
            { key: 'team_name', title: 'Команда', type: 'text' },
            { key: 'first_season_name', title: 'Первый сезон', type: 'text' },
            { key: 'first_season_total_points', title: 'Кол-во очков в первом сезоне', type: 'text' },
            // { key: 'first_season_avg_points', title: 'Среднее кол-во очков', type: 'text' },
            { key: 'second_season_name', title: 'Второй сезон', type: 'text' },
            { key: 'second_season_total_points', title: 'Кол-во очков во втором сезоне', type: 'text' },
            // { key: 'second_season_avg_points', title: 'Среднее кол-во очков', type: 'text' },
            // {
            //     key: 'points_diff',
            //     title: 'Разница общего кол-ва очков',
            //     type: 'number',
            //     displayValue: (row) =>
            //         row.points_diff !== undefined
            //             ? `${row.points_diff > 0 ? '+' : ''}${row.points_diff}`
            //             : '-'
            // },
            {
                key: 'improvement_percentage',
                title: 'Прогресс',
                type: 'number',
                displayValue: (row) =>
                    row.improvement_percentage !== undefined
                        ? `${row.improvement_percentage > 0 ? '+' : ''}${row.improvement_percentage}%`
                        : '-'
            },
            {
                key: 'wins_diff',
                title: 'Победы',
                type: 'number',
                displayValue: (row) =>
                    row.wins_diff !== undefined
                        ? `${row.wins_diff > 0 ? '+' : ''}${row.wins_diff}`
                        : '-'
            },
            {
                key: 'losses_diff',
                title: 'Поражения',
                type: 'number',
                displayValue: (row) =>
                    row.losses_diff !== undefined
                        ? `${row.losses_diff > 0 ? '+' : ''}${row.losses_diff}`
                        : '-'
            },
            {
                key: 'draws_diff',
                title: 'Ничьи',
                type: 'number',
                displayValue: (row) =>
                    row.draws_diff !== undefined
                        ? `${row.draws_diff > 0 ? '+' : ''}${row.draws_diff}`
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
};