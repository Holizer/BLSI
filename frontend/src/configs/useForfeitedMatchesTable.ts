import { useTableConfig } from "../hooks/useTableConfig";
import { IForfeitedMatch } from "@/models/views/IForfeitedMatch";

export const useForfeitedMatchesTable = () => {
    const tableId = 'forfeiting-matches-table';
    
    const tableConfig = useTableConfig<IForfeitedMatch>(() => ({
        applyDelete: false,
        columns: [
            { key: 'team1_name', title: 'Команда 1', type: 'text' },
            { key: 'team2_name', title: 'Команда 2', type: 'text' },
            { key: 'event_date', title: 'Дата проведения', type: 'text' },
            { key: 'event_time', title: 'Время проведения', type: 'text' },
            { key: 'status', title: 'Сатуст', type: 'text' },
            { key: 'forfeiting_team_name', title: 'Неявившееся команда', type: 'text' },
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