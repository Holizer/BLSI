import Search from '../UI/Search/Search';
import classes from './../styles/layout.module.scss';
import EditButton from '../UI/Edit/EditButton';
import { useEffect } from 'react';
import Table from '../UI/Table/Table';
import { observer } from 'mobx-react-lite';
import CreatePlayerForm from '../components/CreateForm/CreatePlayerForm';
import { useAppContext } from '../hooks/useAppContext';
import { usePlayerTeamTable } from '../configs/usePlayerTeamTable';
import ModalOpenButton from '../UI/ModalOpenButton/ModalOpenButton';
import { usePlayerStatiscticsTable } from '../configs/usePlayerStatiscticsTable';

const PlayersManager: React.FC = () => {
    const { playerStore, seasonStore } = useAppContext();
    const { playerTeams, playerStatistics } = playerStore;

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
    
    useEffect(() => {
        const load = async () => {
            await playerStore.fetchPlayerTeamView();
            await playerStore.fetchPlayerStatistics(seasonStore.activeSeason.season_id, seasonStore.getAllWeeksIdsInLastSeason());
        };
        load();
    }, [seasonStore.activeSeason]);
    
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
                <Table
                    config={playerStatisticsConfig} 
                    data={playerStatistics || []}
                    tableId={playerStatisticsTableId}
                />
            </div>
        </main>
    );
};

export default observer(PlayersManager);