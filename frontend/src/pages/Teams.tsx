import classes from './../styles/layout.module.scss';
import Search from '../UI/Search/Search';
import EditButton from '../UI/Edit/EditButton';
import Table from '../UI/Table/Table';
import CreateTeamForm from '../components/CreateForm/CreateTeamForm';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { useTeamCapitanCoachTable } from '../configs/useTeamCapitanCoachTable';
import { useTeamCoachTable } from '../configs/useTeamCoachTable';
import ModalOpenButton from '../UI/ModalOpenButton/ModalOpenButton';

const Teams = () => {
    const { teamStore, coachStore } = useAppContext();
    const { teamsDetailed } = teamStore;
    const { coaches } = coachStore;

    // Team table management
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

    // Coach table management
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

    useEffect(() => {
        teamStore.loadAllTeamsData();
        coachStore.fetchCoaches();
    }, [teamStore, coachStore]);

    return (
        <main className={classes.layout__container}>
            <div className={classes.content__block}>
                <div className={classes.block__header}>
                    <h2>Список команд</h2>
                    <Search />
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
                    data={teamsDetailed || []}
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
                    <h2>Список тренеров</h2>
                    <Search />
                    <EditButton
                        isEditing={isCoachesEditing[coachTableId]} 
                        tableId={coachTableId}
                        onEdit={toggleCoachesEditMode} 
                        onCancel={() => toggleCoachesEditMode(coachTableId, false)}
                        onSave={() => handleSaveCoachTeamsTable(coachTableId)}
                    />
                </div>
                <Table 
                    config={teamCoachTableConfig} 
                    data={coaches || []}
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