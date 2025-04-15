import { ISeasonPlaygroundViews } from "@/models/playground/ISeasonPlaygroundViews";
import { useTableConfig } from "../hooks/useTableConfig";

export const useSeasonPlaygroundViews = () => {
    const tableId = 'season-playground-views-table';
    
    const tableConfig = useTableConfig<ISeasonPlaygroundViews>(() => ({
        applyDelete: false,
        columns: [
            { key: 'playground_name', title: 'Площадка', type: 'text' },
            { key: 'total_views', title: 'Общее число просмотров', type: 'text' },
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