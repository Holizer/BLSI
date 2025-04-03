import Search from '../UI/Search/Search';
import classes from './../styles/layout.module.scss';
import { observer } from 'mobx-react-lite';
import EditButton from '../UI/Edit/EditButton';
import useTableManager from '../hooks/useTableManager';
import Table from '../UI/Table/Table';
import { TableColumn, TableConfig } from '@/types/table';
import { useContext, useEffect } from 'react';
import { AppContext } from '../index';
import { IPlaygroundType } from '@/models/IPlaygroundType';
import { IPlayground } from '@/models/IPlayground';
import CreatePlaygroundType from '../components/CreateForm/CreatePlaygroundTypeForm';
import CreatePlaygroundForm from '../components/CreateForm/CreatePlaygroundForm';

const Playgrounds = () => {
    const { playgroundStore } = useContext(AppContext);
    const { playground_types, playgrounds } = playgroundStore;
    
    const {
        isEditing: isPlaygroundsEditing,
        handleTableChange: handlePlaygroundsTableChange,
        toggleDeleteRow: togglePlaygroundsDeleteRow,
        toggleEditMode: togglePlaygroundsEditMode,
        resetTableState: resetPlaygroundsTableState,
        getRowsToDelete: getPlaygroundsRowsToDelete,
        getRowsToEdit: getPlaygroundsRowsToEdit
    } = useTableManager<IPlayground>();

    const {
        isEditing: isTypesEditing,
        handleTableChange: handleTypesTableChange,
        toggleDeleteRow: toggleTypesDeleteRow,
        toggleEditMode: toggleTypesEditMode,
        resetTableState: resetTypesTableState,
        getRowsToDelete: getTypesRowsToDelete,
        getRowsToEdit: getTypesRowsToEdit
    } = useTableManager<IPlaygroundType>();

    const playgroundTypesTableConfig: TableConfig<IPlaygroundType> = {
        applyDelete: true,
        columns: [
            { key: 'playground_type', title: 'Тип игровой площадки', editable: true, type: 'text' },
        ] as TableColumn<IPlaygroundType>[],
    };

    const playgroundsTableConfig: TableConfig<IPlayground> = {
        applyDelete: true,
        columns: [
            { key: 'playground_name', title: 'Название', editable: true, type: 'text', maxLength: 150 },
            { key: 'capacity', title: 'Вместимость', editable: true, type: 'number', min: 0, max: 100000, maxLength: 5 },
            {
				key: 'playground_type_id',
                title: 'Тип игровой площадки', 
				editable: true,
				type: 'select',
				emptyValueText: 'Неизвестный тип',
				options: playgroundStore.playground_types.map((type) => ({
					value: type.playground_type_id,
					label: type.playground_type,
				})),
				displayValue: (rowData) => {
					const type = playgroundStore.playground_types.find(t => t.playground_type_id === rowData.playground_type_id);
					return type?.playground_type || 'Неизвестный тип';
				}
			}
        ] as TableColumn<IPlayground>[],
    };

    const fetchPlaygroundData = async () => {
        await playgroundStore.fetchPlaygroundTypes();        
        await playgroundStore.fetchPlaygrounds();        
    };
    
    useEffect(() => {
        fetchPlaygroundData();
    }, []);

    const handlePlaygroundsTableSave = async (tableId: string) => {
        try {
            const rowsToEdit = getPlaygroundsRowsToEdit(tableId);
            const rowsToDelete = getPlaygroundsRowsToDelete(tableId);

            if (Object.keys(rowsToEdit).length === 0 && Object.keys(rowsToDelete).length === 0) {
                resetPlaygroundsTableState(tableId);
                return;
            }

            await Promise.all([
                ...Object.values(rowsToEdit).map(changes => 
                    playgroundStore.updatePlayground(changes as IPlayground)
                ),
                ...Object.values(rowsToDelete).map((deleted) =>
                    deleted.playground_id ? playgroundStore.deletePlayground(deleted.playground_id) : Promise.resolve()
                )
            ]);
                
            await fetchPlaygroundData();
            resetPlaygroundsTableState(tableId);
        } catch (error) {
            console.error("Ошибка при сохранении площадок:", error);
        }
    };

    const handleTypesTableSave = async (tableId: string) => {
        try {
            const rowsToEdit = getTypesRowsToEdit(tableId);
            const rowsToDelete = getTypesRowsToDelete(tableId);

            if (Object.keys(rowsToEdit).length === 0 && Object.keys(rowsToDelete).length === 0) {
                resetTypesTableState(tableId);
                return;
            }

            await Promise.all([
                ...Object.values(rowsToEdit).map(changes => 
                    playgroundStore.updatePlaygroundType(changes as IPlaygroundType)
                ),
                ...Object.values(rowsToDelete).map((deleted) =>
                    deleted.playground_type_id ? playgroundStore.deletePlaygroundType(deleted.playground_type_id) : Promise.resolve()
                )
            ]);
                
            await fetchPlaygroundData();
            resetTypesTableState(tableId);
        } catch (error) {
            console.error("Ошибка при сохранении типов площадок:", error);
        }
    };

    return (
        <main className={classes.layout__container}>
            <div className={classes.content__block}>
                <div className={classes.block__header}>
                    <h2>Игровые площадки</h2>
                    <Search />
                    <EditButton
                        isEditing={!!isPlaygroundsEditing['playgroundsTable']} 
                        tableId="playgroundsTable"
                        onEdit={togglePlaygroundsEditMode} 
                        onCancel={() => togglePlaygroundsEditMode('playgroundsTable', false)}
                        onSave={() => handlePlaygroundsTableSave('playgroundsTable')}
                    />
                </div>
                <Table
                    config={playgroundsTableConfig} 
                    data={playgrounds || []}
                    tableId="playgroundsTable"
                    isEditing={!!isPlaygroundsEditing['playgroundsTable']}
                    onToggleEdit={() => togglePlaygroundsEditMode('playgroundsTable')}
                    onEditChange={(
                        rowIndex: number, 
                        updatedData: IPlayground
                    ) => handlePlaygroundsTableChange('playgroundsTable', rowIndex, updatedData)}
                    onDeleteToggle={(tableId, rowIndex, rowData) => 
                        togglePlaygroundsDeleteRow(tableId, rowIndex, rowData)
                    }
                    rowsToDelete={getPlaygroundsRowsToDelete('playgroundsTable')}
                />
            </div>
            <CreatePlaygroundForm />

            <div className={classes.content__block}>
                <div className={classes.block__header}>
                    <h2>Типы игровых площадок</h2>
                    <Search />
                    <EditButton
                        isEditing={!!isTypesEditing['playgroundTypesTable']} 
                        tableId="playgroundTypesTable"
                        onEdit={toggleTypesEditMode} 
                        onCancel={() => toggleTypesEditMode('playgroundTypesTable', false)}
                        onSave={() => handleTypesTableSave('playgroundTypesTable')}
                    />
                </div>
                <Table
                    config={playgroundTypesTableConfig} 
                    data={playground_types || []}
                    tableId="playgroundTypesTable"
                    isEditing={!!isTypesEditing['playgroundTypesTable']}
                    onToggleEdit={() => toggleTypesEditMode('playgroundTypesTable')}
                    onEditChange={(
                        rowIndex: number, 
                        updatedData: IPlaygroundType
                    ) => handleTypesTableChange('playgroundTypesTable', rowIndex, updatedData)}
                    onDeleteToggle={(tableId, rowIndex, rowData) => 
                        toggleTypesDeleteRow(tableId, rowIndex, rowData)
                    }
                    rowsToDelete={getTypesRowsToDelete('playgroundTypesTable')}
                />
            </div>
            <CreatePlaygroundType/>
        </main>
    );
};

export default observer(Playgrounds);