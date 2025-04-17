import Search from '../UI/Search/Search';
import classes from './../styles/layout.module.scss';
import EditButton from '../UI/Edit/EditButton';
import { useEffect, useMemo } from 'react';
import Table from '../UI/Table/Table';
import { observer } from 'mobx-react-lite';
import CreatePlayerForm from '../components/CreateForm/CreatePlayerForm';
import { useAppContext } from '../hooks/useAppContext';
import { usePlayerTeamTable } from '../configs/players/usePlayerTeamTable';
import ModalOpenButton from '../UI/ModalOpenButton/ModalOpenButton';
import { usePlayerStatiscticsTable } from '../configs/players/usePlayerStatiscticsTable';
import { useSeasonPlayerBestGameTable } from '../configs/players/useSeasonPlayerBestGameTable';
import { useTableSearch } from '../hooks/useTableSearch';

const Players = () => {
    const { playerStore, seasonStore } = useAppContext();
    const { playerTeams } = playerStore;
    const { playersStatistic, playersBestGame } = seasonStore;
    
    //#region CONFIGS
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

    const { handleSearch, getFilteredData } = useTableSearch();
    //#endregion

    //#region FILTERS AND TABLES
    const filteredPlayerStats = getFilteredData(
        playerStatisticsTableId,
        playersStatistic,
        playerStatisticsConfig
    );

    const filteredBestGames = getFilteredData(
        seasonPlayerBestGameTableId,
        playersBestGame,
        seasonPlayerBestGamesConfig
    );

    const filteredPlayerTeams = getFilteredData(
        playerTeamTableId,
        playerTeams,
        playerTeamViewConfig
    );

    const memoizedPlayerStatsTable = useMemo(() => (
        <Table
            config={playerStatisticsConfig} 
            data={filteredPlayerStats || []}
            tableId={playerStatisticsTableId}
        />
    ), [playersStatistic, playerStatisticsConfig, playerStatisticsTableId]);
    
    const memoizedSeasonPlayerBestGameTable = useMemo(() => (
        <Table
            config={seasonPlayerBestGamesConfig} 
            data={filteredBestGames || []}
            tableId={seasonPlayerBestGameTableId}
        />
    ), [playersBestGame, seasonPlayerBestGamesConfig, seasonPlayerBestGameTableId]);
    //#endregion

    useEffect(() => {
        const { selectedSeasonId, selectedWeekId } = seasonStore;
        
        if (selectedSeasonId) {
            seasonStore.fetchPlayersStatistic(selectedSeasonId, selectedWeekId)
            seasonStore.fetchPlayersBestGame(selectedSeasonId)
        }
    }, [seasonStore.selectedSeasonId, seasonStore.selectedWeekId]);
    
    return (
        <main className={classes.layout__container}>
            <div className={classes.content__block}>
                <div className={classes.block__header}>
                    <h2>Список игроков</h2>
                    <Search  tableId={playerTeamTableId} onSearch={handleSearch}/>
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
                    data={filteredPlayerTeams || []}
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
                        <Search tableId={playerStatisticsTableId} onSearch={handleSearch}/>
                    </div>
                    {memoizedPlayerStatsTable}
            </div>

            <div className={classes.content__block}>
                <div className={classes.block__header}>
                    <h2>Максимальное кол-во очков за игру в сезоне</h2>
                    <Search tableId={seasonPlayerBestGameTableId} onSearch={handleSearch}/>
                </div>
                {memoizedSeasonPlayerBestGameTable}
            </div>
        </main>
    );
};

export default observer(Players);