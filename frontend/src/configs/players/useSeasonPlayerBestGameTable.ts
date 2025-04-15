import { useTableConfig } from "../../hooks/useTableConfig";
import { ISeasonPlayerBestGame } from "@/models/player/ISeasonPlayerBestGame";

export const useSeasonPlayerBestGameTable = () => {
    const tableId = 'season-player-best-game-table';
    
    const tableConfig = useTableConfig<ISeasonPlayerBestGame>(() => ({
        applyDelete: false,
        columns: [
            { key: 'player_name', title: 'Игрок', type: 'text' },
            { key: 'max_scored_points', title: 'Набрано очков', type: 'text' },
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