import { ICompletedMatch } from "@/models/match/ICompletedMatch";
import { useTableConfig } from "../../hooks/useTableConfig";

export const useCompletedMatchesTable = () => {
    const tableId = 'comleted-matches-table';
    
    const tableConfig = useTableConfig<ICompletedMatch>(() => ({
        applyDelete: false,
        columns: [
            { key: 'team1_name', title: 'Команда 1', type: 'text' },
            { key: 'team1_points', title: 'Кол-во очков', type: 'text' },
            { key: 'team2_name', title: 'Команда 2', type: 'text' },
            { key: 'team2_points', title: 'Кол-во очков', type: 'text' },
            { key: 'event_date', title: 'Дата проведения', type: 'text' },
            { key: 'event_time', title: 'Время проведения', type: 'text' },
            { key: 'playground_name', title: 'Игровая площадка', type: 'text' },
            { key: 'winner', title: 'Победившая команда', type: 'text' },
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