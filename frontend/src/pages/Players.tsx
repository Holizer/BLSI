import Search from '../UI/Search/Search';
import classes from './../styles/layout.module.scss';
import EditButton from '../UI/Edit/EditButton';
import { useEffect, useMemo } from 'react';
import Table from '../UI/Table/Table';
import { observer } from 'mobx-react-lite';
import CreatePlayerForm from '../components/CreateForm/CreatePlayerForm';
import { useAppContext } from '../hooks/useAppContext';
import { usePlayerTeamTable } from '../configs/usePlayerTeamTable';
import ModalOpenButton from '../UI/ModalOpenButton/ModalOpenButton';
import { usePlayerStatiscticsTable } from '../configs/usePlayerStatiscticsTable';
import { useSeasonPlayerBestGameTable } from '../configs/useSeasonPlayerBestGameTable';

const PlayersManager: React.FC = () => {
    const { playerStore, seasonStore } = useAppContext();
    const { playerTeams } = playerStore;
    const { playersStatistic, playersBestGame } = seasonStore;

    const {
        tableId: playerTeamTableId,
        config: playerTeamViewConfig,
        isEditing,
        handleTableChange,
        toggleDeleteRow,
        toggleEditMode,
        getRowsToDelete,
        handleSave,
    } = usePlayerTeamTable();
    
    const {
        tableId: playerStatisticsTableId,
        config: playerStatisticsConfig,
    } = usePlayerStatiscticsTable();

    const {
        tableId: seasonPlayerBestGameTableId,
        config: seasonPlayerBestGamesConfig,
    } = useSeasonPlayerBestGameTable();

    useEffect(() => {
        const { selectedSeasonId, selectedWeekId } = seasonStore;
        
        if (selectedSeasonId) {
            seasonStore.fetchPlayersStatistic(selectedSeasonId, selectedWeekId)
            seasonStore.fetchPlayersBestGame(selectedSeasonId)
        }
    }, [seasonStore.selectedSeasonId, seasonStore.selectedWeekId]);
    
    const memoizedPlayerStatsTable = useMemo(() => (
        <Table
            config={playerStatisticsConfig} 
            data={playersStatistic || []}
            tableId={playerStatisticsTableId}
        />
    ), [playersStatistic, playerStatisticsConfig, playerStatisticsTableId]);

    const memoizedSeasonPlayerBestGameTable = useMemo(() => (
        <Table
            config={seasonPlayerBestGamesConfig} 
            data={playersBestGame || []}
            tableId={seasonPlayerBestGameTableId}
        />
    ), [playersBestGame, seasonPlayerBestGamesConfig, seasonPlayerBestGameTableId]);

    return (
        <main className={classes.layout__container}>
            <div className={classes.content__block}>
                <div className={classes.block__header}>
                    <h2>Список игроков</h2>
                    <Search />
                    <EditButton
                        isEditing={isEditing[playerTeamTableId]} 
                        tableId={playerTeamTableId}
                        onEdit={toggleEditMode} 
                        onCancel={() => toggleEditMode(playerTeamTableId, false)}
                        onSave={() => handleSave(playerTeamTableId)}
                    />
                    <ModalOpenButton modalItem={ <CreatePlayerForm/> } >
                        +
                    </ModalOpenButton>
                </div>
                <Table
                    config={playerTeamViewConfig} 
                    data={playerTeams || []}
                    tableId={playerTeamTableId}
                    isEditing={isEditing[playerTeamTableId]}
                    onToggleEdit={() => toggleEditMode(playerTeamTableId)}
                    onEditChange={(
                        rowIndex: number, 
                        updatedData
                    ) => handleTableChange(playerTeamTableId, rowIndex, updatedData)}
                    onDeleteToggle={(tableId, rowIndex, rowData) => 
                        toggleDeleteRow(tableId, rowIndex, rowData)
                    }
                    rowsToDelete={getRowsToDelete(playerTeamTableId)}
                />
            </div>

            <div className={classes.content__block}>
                <div className={classes.block__header}>
                    <h2>Статистика игроков</h2>
                    <Search />
                </div>
                {memoizedPlayerStatsTable}
            </div>

            <div className={classes.content__block}>
                <div className={classes.block__header}>
                    <h2>Лучшие игры игроков в сезоне</h2>
                    <Search />
                </div>
                {memoizedSeasonPlayerBestGameTable}
            </div>
        </main>
    );
};

export default observer(PlayersManager);