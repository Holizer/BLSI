import classes from './../styles/layout.module.scss';
import Search from '../UI/Search/Search';
import EditButton from '../UI/Edit/EditButton';
import Table from '../UI/Table/Table';
import CreateTeamForm from '../components/CreateForm/CreateTeamForm';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useTeamCapitanCoachTable } from '../configs/teams/useTeamCapitanCoachTable';
import { useTeamCoachTable } from '../configs/teams/useTeamCoachTable';
import ModalOpenButton from '../UI/ModalOpenButton/ModalOpenButton';
import { useTeamSeasonStatsTable } from '../configs/teams/useTeamSeasonStatsTable';
import CreateCoachForm from '../components/CreateForm/CreateCoachForm';
import { useTableSearch } from '../hooks/useTableSearch';

const Teams = () => {
    const { teamStore, seasonStore, coachStore } = useAppContext();
    const { teamsDetailed } = teamStore;
    const { teamsStatistics } = seasonStore;
    const { coaches } = coachStore;
    
    //#region CONFIGS
    const {
        tableId: teamTableId,
        config: teamCoachCaptainViewConfig,
        isEditing: isTeamsEditing,
        handleTableChange: handleTeamsTableChange,
        toggleDeleteRow: toggleTeamsDeleteRow,
        toggleEditMode: toggleTeamsEditMode,
        getRowsToDelete: getTeamsRowsToDelete,
        handleSave: handleSaveTeamsTable,
    } = useTeamCapitanCoachTable();

    const {
        tableId: coachTableId,
        config: teamCoachTableConfig,
        isEditing: isCoachesEditing,
        handleTableChange: handleCoachesTableChange,
        toggleDeleteRow: toggleCoachesDeleteRow,
        toggleEditMode: toggleCoachesEditMode,
        getRowsToDelete: getCoachesRowsToDelete,
        handleSave: handleSaveCoachTeamsTable,
    } = useTeamCoachTable();

    const {
        tableId: teamSeasonStatsTableId,
        config: teamSeasonStatsTableConfig,
    } = useTeamSeasonStatsTable();
    //#endregion
    
    useEffect(() => {
        teamStore.loadAllTeamsData();
        coachStore.fetchCoaches();
    }, [teamStore, coachStore, seasonStore]);

    useEffect(() => {
        const { selectedSeasonId, selectedWeekId } = seasonStore;
        
        if (selectedSeasonId) {
            seasonStore.fetchTeamsStatistic(selectedSeasonId, selectedWeekId)
        }
    }, [seasonStore.selectedSeasonId, seasonStore.selectedWeekId]);

    //#region FILTERS AND TABLES
    const { handleSearch, getFilteredData } = useTableSearch(); 
    const filteredCoaches = getFilteredData(coachTableId, coaches, teamCoachTableConfig);    
    const filteredTeamsDetailed = getFilteredData(teamTableId, teamsDetailed, teamCoachCaptainViewConfig);    
    
    const filteredTeamStats= getFilteredData(teamSeasonStatsTableId, teamsStatistics, teamSeasonStatsTableConfig); 
    const memoizedTeamStatsTable = useMemo(() => (
        <Table 
            config={teamSeasonStatsTableConfig} 
            data={filteredTeamStats || []}
            tableId={teamSeasonStatsTableId}
        />
    ), [teamsStatistics, teamSeasonStatsTableConfig, teamSeasonStatsTableId]);
    //#endregion
    
    return (
        <main className={classes.layout__container}>
            <div className={classes.content__block}>
                <div className={classes.block__header}>
                    <h2>Список команд</h2>
                    <Search  tableId={teamTableId} onSearch={handleSearch}/>
                    <EditButton
                        isEditing={isTeamsEditing[teamTableId]} 
                        tableId={teamTableId}
                        onEdit={toggleTeamsEditMode} 
                        onCancel={() => toggleTeamsEditMode(teamTableId, false)}
                        onSave={() => handleSaveTeamsTable(teamTableId)}
                    />
                    <ModalOpenButton modalItem={ <CreateTeamForm/> } >
                        +
                    </ModalOpenButton>
                </div>
                <Table 
                    config={teamCoachCaptainViewConfig} 
                    data={filteredTeamsDetailed || []}
                    tableId={teamTableId}
                    isEditing={isTeamsEditing[teamTableId]}
                    onToggleEdit={() => toggleTeamsEditMode(teamTableId)}
                    onEditChange={(rowIndex, updatedData) => 
                        handleTeamsTableChange(teamTableId, rowIndex, updatedData)
                    }
                    onDeleteToggle={(tableId, rowIndex, rowData) => 
                        toggleTeamsDeleteRow(tableId, rowIndex, rowData)
                    }
                    rowsToDelete={getTeamsRowsToDelete(teamTableId)}
                />
            </div>

            <div className={classes.content__block}>
                <div className={classes.block__header}>
                    <h2>Статистика команд</h2>
                    <Search  tableId={teamSeasonStatsTableId} onSearch={handleSearch}/>
                </div>
                {memoizedTeamStatsTable}
            </div>
            
            <div className={classes.content__block}>
                <div className={classes.block__header}>
                    <h2>Список тренеров</h2>
                    <Search  tableId={coachTableId} onSearch={handleSearch}/>
                    <EditButton
                        isEditing={isCoachesEditing[coachTableId]} 
                        tableId={coachTableId}
                        onEdit={toggleCoachesEditMode} 
                        onCancel={() => toggleCoachesEditMode(coachTableId, false)}
                        onSave={() => handleSaveCoachTeamsTable(coachTableId)}
                    />
                    <ModalOpenButton modalItem={ <CreateCoachForm/> } >
                        +
                    </ModalOpenButton>
                </div>
                <Table 
                    config={teamCoachTableConfig} 
                    data={filteredCoaches || []}
                    tableId={coachTableId}
                    isEditing={isCoachesEditing[coachTableId]}
                    onToggleEdit={() => toggleCoachesEditMode(coachTableId)}
                    onEditChange={(rowIndex, updatedData) => 
                        handleCoachesTableChange(coachTableId, rowIndex, updatedData)
                    }
                    onDeleteToggle={(tableId, rowIndex, rowData) => 
                        toggleCoachesDeleteRow(tableId, rowIndex, rowData)
                    }
                    rowsToDelete={getCoachesRowsToDelete(coachTableId)}
                />
            </div>
        </main>
    );
};

export default observer(Teams);