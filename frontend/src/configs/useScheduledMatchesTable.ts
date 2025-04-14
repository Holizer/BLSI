import { useTableConfig } from "../hooks/useTableConfig";
import { IScheduledMatch } from "../models/match/IScheduledMatch";

export const useScheduledMatchesTable = () => {
    const tableId = 'scheduled-matches-table';
    
    const tableConfig = useTableConfig<IScheduledMatch>(() => ({
        applyDelete: false,
        columns: [
            { key: 'team1_name', title: 'Команда 1', type: 'text' },
            { key: 'team2_name', title: 'Команда 2', type: 'text' },
            { key: 'event_date', title: 'Дата проведения', type: 'text' },
            { key: 'event_time', title: 'Время проведения', type: 'text' },
            { key: 'playground_name', title: 'Игровая площадка', type: 'text' },
            { key: 'season_name', title: 'Сезон', type: 'text' },
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