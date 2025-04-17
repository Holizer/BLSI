import Search from '../UI/Search/Search';
import classes from './../styles/layout.module.scss';
import { useEffect, useMemo, useState } from 'react';
import Table from '../UI/Table/Table';
import { observer } from 'mobx-react-lite';
import { useAppContext } from '../hooks/useAppContext';
import { usePlayerSeasonProgressTable } from '../configs/players/usePlayerSeasonProgressTable';
import Select from '../UI/Select/Select';
import { useTeamSeasonProgressTable } from '../configs/teams/useTeamSeasonProgressTable';
import { useSeasonTable } from '../configs/seasons/useSeasonTable';
import EditButton from '../UI/Edit/EditButton';
import ModalOpenButton from '../UI/ModalOpenButton/ModalOpenButton';
import CreateSeasonForm from '../components/CreateForm/CreateSeasonForm';
import { useTableSearch } from '../hooks/useTableSearch';

const Seasons = () => {
    const { seasonStore } = useAppContext();
    const { playersSeasonProgress, teamsSeasonProgress, seasonWithWeeks } = seasonStore;
    
    const [firstSeasonId, setFirstSeasonId] = useState<number | undefined>();
    const [secondSeasonId, setSecondSeasonId] = useState<number | undefined>();

    useEffect(() => {
        if (seasonWithWeeks.length > 0) {
            setFirstSeasonId(seasonWithWeeks[0].season_id);
            setSecondSeasonId(seasonWithWeeks[1]?.season_id);
        }
    }, [seasonWithWeeks]);

    //#region CONFIGS
    const {
        tableId: playerSeasonProgressTableId,
        config: playerSeasonProgressConfig,
    } = usePlayerSeasonProgressTable();
    
    const {
        tableId: teamSeasonProgressTableId,
        config: teamSeasonProgressConfig,
    } = useTeamSeasonProgressTable();
    
    const {
        tableId: seasonTableId,
        config: seasonTableConfig,
        isEditing: isSeasonEditing,
        handleTableChange: handleSeasonChange,
        toggleDeleteRow: toggleSeasonDelete,
        toggleEditMode: toggleSeasonEdit,
        getRowsToDelete: getSeasonRowsToDelete,
        handleSave: handleSeasonSave,
    } = useSeasonTable();
    //#endregion
    
    //#region FILTERS AND TABLES
    const { handleSearch, getFilteredData } = useTableSearch(); 
    const filteredSeasons = getFilteredData(seasonTableId, seasonWithWeeks, seasonTableConfig);    
    
    const filteredPlayerSeasonProgress = getFilteredData(playerSeasonProgressTableId, playersSeasonProgress, playerSeasonProgressConfig);    
    const memoizedPlayerSeasonProgressTable = useMemo(() => (
        <Table
            config={playerSeasonProgressConfig} 
            data={filteredPlayerSeasonProgress || []}
            tableId={playerSeasonProgressTableId}
        />
    ), [playersSeasonProgress, playerSeasonProgressConfig, playerSeasonProgressTableId]);

    const filteredTeamSeasonProgress = getFilteredData(teamSeasonProgressTableId, teamsSeasonProgress, teamSeasonProgressConfig);    
    const memoizedTeamSeasonProgressTable = useMemo(() => (
        <Table
            config={teamSeasonProgressConfig} 
            data={filteredTeamSeasonProgress || []}
            tableId={teamSeasonProgressTableId}
        />
    ), [teamsSeasonProgress, teamSeasonProgressConfig, teamSeasonProgressTableId]);
    //#endregion

    const handleApply = (table_id: string) => {
        if (!firstSeasonId || !secondSeasonId) return

        switch (table_id) {
            case playerSeasonProgressTableId:
                seasonStore.fetchPlayersSeasonPrоgess(firstSeasonId, secondSeasonId);
                break;

            case teamSeasonProgressTableId:
                seasonStore.fetchTeamsSeasonPrоgess(firstSeasonId, secondSeasonId);
                break;

            default:
                break;
        }
    };

    return (
        <main className={classes.layout__container}>
            <div className={classes.content__block}>
                <div className={classes.block__header}>
                    <h2>Прогресс игроков</h2>
                    <Search tableId={playerSeasonProgressTableId} onSearch={handleSearch}/>
                    <div className={classes.seasons_choise_bar}>
                    <Select
                        value={firstSeasonId}
                        onChange={(e) => setFirstSeasonId(Number(e.target.value))}
                        options={seasonWithWeeks
                            .filter(season => season.season_id !== secondSeasonId)
                            .map(season => ({
                                value: season.season_id,
                                label: season.season_name
                            }))
                        }
                        label="Выберите первый сезон"
                    />

                    <Select
                        value={secondSeasonId}
                        onChange={(e) => setSecondSeasonId(Number(e.target.value))}
                        options={seasonWithWeeks
                            .filter(season => season.season_id !== firstSeasonId)
                            .map(season => ({
                                value: season.season_id,
                                label: season.season_name
                            }))
                        }
                        label="Выберите второй сезон"
                    />

                        <button 
                            onClick={() => handleApply(playerSeasonProgressTableId)}
                            disabled={!firstSeasonId || !secondSeasonId}
                        >
                            Применить
                        </button>
                    </div>
                </div>
                {memoizedPlayerSeasonProgressTable}
            </div>

            <div className={classes.content__block}>
                <div className={classes.block__header}>
                    <h2>Прогресс команд</h2>
                    <Search tableId={teamSeasonProgressTableId} onSearch={handleSearch}/>
                    <div className={classes.seasons_choise_bar}>
                    <Select
                        value={firstSeasonId}
                        onChange={(e) => setFirstSeasonId(Number(e.target.value))}
                        options={seasonWithWeeks
                            .filter(season => season.season_id !== secondSeasonId)
                            .map(season => ({
                                value: season.season_id,
                                label: season.season_name
                            }))
                        }
                        label="Выберите первый сезон"
                    />

                    <Select
                        value={secondSeasonId}
                        onChange={(e) => setSecondSeasonId(Number(e.target.value))}
                        options={seasonWithWeeks
                            .filter(season => season.season_id !== firstSeasonId)
                            .map(season => ({
                                value: season.season_id,
                                label: season.season_name
                            }))
                        }
                        label="Выберите второй сезон"
                    />

                        <button 
                            onClick={() => handleApply(teamSeasonProgressTableId)}
                            disabled={!firstSeasonId || !secondSeasonId}
                        >
                            Применить
                        </button>
                    </div>
                </div>
                {memoizedTeamSeasonProgressTable}
            </div>

            <div className={classes.content__block}>
                <div className={classes.block__header}>
                    <h2>Cезоны</h2>
                    <Search tableId={seasonTableId} onSearch={handleSearch}/>
                    <EditButton
                        isEditing={isSeasonEditing[seasonTableId]} 
                        tableId={seasonTableId}
                        onEdit={toggleSeasonEdit} 
                        onCancel={() => toggleSeasonEdit(seasonTableId, false)}
                        onSave={() => handleSeasonSave(seasonTableId)}
                    />
                    <ModalOpenButton modalItem={ <CreateSeasonForm/> } >
                        +
                    </ModalOpenButton>
                </div>
                
                <Table
                    config={seasonTableConfig} 
                    data={filteredSeasons || []}
                    tableId={seasonTableId}
                    isEditing={isSeasonEditing[seasonTableId]} 
                    onToggleEdit={() => toggleSeasonEdit(seasonTableId)}
                    onEditChange={(rowIndex: number, updatedData) => 
                        handleSeasonChange(seasonTableId, rowIndex, updatedData)
                    }
                    onDeleteToggle={(tableId, rowIndex, rowData) => 
                        toggleSeasonDelete(tableId, rowIndex, rowData)
                    }
                    rowsToDelete={getSeasonRowsToDelete(seasonTableId)}
                />
            </div>
        </main>
    );
};

export default observer(Seasons);