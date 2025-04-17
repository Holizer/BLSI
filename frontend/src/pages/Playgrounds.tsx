import Search from '../UI/Search/Search';
import classes from './../styles/layout.module.scss';
import { observer } from 'mobx-react-lite';
import EditButton from '../UI/Edit/EditButton';
import Table from '../UI/Table/Table';
import { useEffect, useMemo } from 'react';
import CreatePlaygroundType from '../components/CreateForm/CreatePlaygroundTypeForm';
import CreatePlaygroundForm from '../components/CreateForm/CreatePlaygroundForm';
import { useAppContext } from '../hooks/useAppContext';
import { usePlaygroundsTable } from '../configs/playgrounds/usePlaygroundsTable';
import { usePlaygroundsTypeTable } from '../configs/playgrounds/usePlaygroundsTypeTable';
import ModalOpenButton from '../UI/ModalOpenButton/ModalOpenButton';
import { useSeasonPlaygroundViews } from '../configs/playgrounds/useSeasonPlaygroundViews';
import { useTableSearch } from '../hooks/useTableSearch';

const Playgrounds = () => {
    const { playgroundStore, seasonStore } = useAppContext();
    const { playground_types, playgrounds } = playgroundStore;
    const { playgroundViews } = seasonStore;

    //#region CONFIGS
    const {
        tableId: playgroundsTableId,
        config: playgroundsConfig, 
        isEditing: isPlaygroundsEditing,
        handleTableChange: handlePlaygroundsChange,
        toggleDeleteRow: togglePlaygroundsDelete,
        toggleEditMode: togglePlaygroundsEdit,
        getRowsToDelete: getPlaygroundsRowsToDelete,
        handleSave: handlePlaygroundsSave,
    } = usePlaygroundsTable();

    const {
        tableId: typesTableId,
        config: typesConfig, 
        isEditing: isTypesEditing,
        handleTableChange: handleTypesChange,
        toggleDeleteRow: toggleTypesDelete,
        toggleEditMode: toggleTypesEdit,
        getRowsToDelete: getTypesRowsToDelete,
        handleSave: handleTypesSave,
    } = usePlaygroundsTypeTable();
    
    const {
        tableId: seasonPlaygroundViewsTableId,
        config: seasonPlaygroundViewstypesConfig, 
    } = useSeasonPlaygroundViews();
    //#endregion
    
    //#region FILTERS AND TABLES
    const { handleSearch, getFilteredData } = useTableSearch(); 
    const filteredPlaygrounds = getFilteredData(playgroundsTableId, playgrounds, playgroundsConfig); 
    const filteredPlaygroundTypes = getFilteredData(typesTableId, playground_types, typesConfig);    

    const memoizedSeasonPlaygroundViewsTable = useMemo(() => (
        <Table
            config={seasonPlaygroundViewstypesConfig} 
            data={playgroundViews || []}
            tableId={seasonPlaygroundViewsTableId}
        />
    ), [playgroundViews, seasonPlaygroundViewstypesConfig, seasonPlaygroundViewsTableId]);
    //#endregion
    
    useEffect(() => {
        playgroundStore.fetchPlaygroundTypes();        
    }, [playgroundStore]);

    useEffect(() => {
        const { selectedSeasonId, selectedWeekId } = seasonStore;
        
        if (selectedSeasonId) {
            seasonStore.fetchPlaygroundViews(selectedSeasonId, selectedWeekId)
        }
    }, [seasonStore.selectedSeasonId, seasonStore.selectedWeekId]);

    return (
        <main className={classes.layout__container}>
            <div className={classes.content__block}>
                <div className={classes.block__header}>
                    <h2>Текущее количество просмотров</h2>
                </div>
                {memoizedSeasonPlaygroundViewsTable}
            </div>

            <div className={classes.content__block}>
                <div className={classes.block__header}>
                    <h2>Игровые площадки</h2>
                    <Search tableId={playgroundsTableId} onSearch={handleSearch} />
                    <EditButton
                        isEditing={isPlaygroundsEditing[playgroundsTableId]} 
                        tableId={playgroundsTableId}
                        onEdit={togglePlaygroundsEdit} 
                        onCancel={() => togglePlaygroundsEdit(playgroundsTableId, false)}
                        onSave={() => handlePlaygroundsSave(playgroundsTableId)}
                    />
                    <ModalOpenButton modalItem={ <CreatePlaygroundForm/> } >
                        +
                    </ModalOpenButton>
                </div>
                <Table
                    config={playgroundsConfig} 
                    data={filteredPlaygrounds || []}
                    tableId={playgroundsTableId}
                    isEditing={isPlaygroundsEditing[playgroundsTableId]}
                    onToggleEdit={() => togglePlaygroundsEdit(playgroundsTableId)}
                    onEditChange={(rowIndex: number, updatedData) => 
                        handlePlaygroundsChange(playgroundsTableId, rowIndex, updatedData)
                    }
                    onDeleteToggle={(tableId, rowIndex, rowData) => 
                        togglePlaygroundsDelete(tableId, rowIndex, rowData)
                    }
                    rowsToDelete={getPlaygroundsRowsToDelete(playgroundsTableId)}
                />
            </div>

            <div className={classes.content__block}>
                <div className={classes.block__header}>
                    <h2>Типы игровых площадок</h2>
                    <Search tableId={typesTableId} onSearch={handleSearch} />
                    <EditButton
                        isEditing={isTypesEditing[typesTableId]} 
                        tableId={typesTableId}
                        onEdit={toggleTypesEdit} 
                        onCancel={() => toggleTypesEdit(typesTableId, false)}
                        onSave={() => handleTypesSave(typesTableId)}
                    />
                    <ModalOpenButton modalItem={ <CreatePlaygroundType/> } >
                        +
                    </ModalOpenButton>
                </div>
                <Table
                    config={typesConfig} 
                    data={filteredPlaygroundTypes || []}
                    tableId={typesTableId}
                    isEditing={isTypesEditing[typesTableId]}
                    onToggleEdit={() => toggleTypesEdit(typesTableId)}
                    onEditChange={(rowIndex: number, updatedData) => 
                        handleTypesChange(typesTableId, rowIndex, updatedData)
                    }
                    onDeleteToggle={(tableId, rowIndex, rowData) => 
                        toggleTypesDelete(tableId, rowIndex, rowData)
                    }
                    rowsToDelete={getTypesRowsToDelete(typesTableId)}
                />
            </div>
        </main>
    );
};

export default observer(Playgrounds);