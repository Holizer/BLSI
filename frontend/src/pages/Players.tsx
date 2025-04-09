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

const PlayersManager: React.FC = () => {
    const { playerStore } = useAppContext();
    const { playerTeamView } = playerStore;

    const {
        tableId,
        config: playerTeamViewConfig,
        isEditing,
        handleTableChange,
        toggleDeleteRow,
        toggleEditMode,
        getRowsToDelete,
        handleSave,
    } = usePlayerTeamTable();

    useEffect(() => {
        playerStore.fetchPlayerTeamView();
    }, []);

    return (
        <main className={classes.layout__container}>
            <div className={classes.content__block}>
                <div className={classes.block__header}>
                    <h2>Список игроков</h2>
                    <Search />
                    <EditButton
                        isEditing={isEditing[tableId]} 
                        tableId={tableId}
                        onEdit={toggleEditMode} 
                        onCancel={() => toggleEditMode(tableId, false)}
                        onSave={() => handleSave(tableId)}
                    />
                    <ModalOpenButton modalItem={ <CreatePlayerForm/> } >
                        +
                    </ModalOpenButton>
                </div>
                <Table
                    config={playerTeamViewConfig} 
                    data={playerTeamView || []}
                    tableId={tableId}
                    isEditing={isEditing[tableId]}
                    onToggleEdit={() => toggleEditMode(tableId)}
                    onEditChange={(
                        rowIndex: number, 
                        updatedData
                    ) => handleTableChange(tableId, rowIndex, updatedData)}
                    onDeleteToggle={(tableId, rowIndex, rowData) => 
                        toggleDeleteRow(tableId, rowIndex, rowData)
                    }
                    rowsToDelete={getRowsToDelete(tableId)}
                />
            </div>
        </main>
    );
};

export default observer(PlayersManager);