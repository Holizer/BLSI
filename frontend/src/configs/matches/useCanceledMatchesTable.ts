import { ICanceledMatch } from "@/models/match/ICanceledMatch";
import { useTableConfig } from "../../hooks/useTableConfig";

export const useCanceledMatchesTable = () => {
    const tableId = 'canceled-matches-table';
    
    const tableConfig = useTableConfig<ICanceledMatch>(() => ({
        applyDelete: false,
        columns: [
            { key: 'team1_name', title: 'Команда 1', type: 'text' },
            { key: 'team2_name', title: 'Команда 2', type: 'text' },
            { key: 'event_date', title: 'Дата проведения', type: 'text' },
            { key: 'event_time', title: 'Время проведения', type: 'text' },
            { key: 'status', title: 'Сатуст', type: 'text' },
            { key: 'cancellation_reason', title: 'Причина отмены', type: 'text' },
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