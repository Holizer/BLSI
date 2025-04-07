import { observer } from 'mobx-react-lite';
import classes from './../styles/layout.module.scss';
import Search from '../UI/Search/Search';
import EditButton from '../UI/Edit/EditButton';
import Table from '../UI/Table/Table';
import { useAppContext } from '../hooks/useAppContext';
import { useEffect } from 'react';
import { useCancellationReasonTable } from '../configs/useCancellationReasonTable';

const Matches = () => {
      const { cancellationReasonStore } = useAppContext();
      const { cancellation_reasons } = cancellationReasonStore;
      
      const {
            tableId: cancellationReasonTableId,
            config: cancellationReasonConfig, 
            isEditing: isCancellationReasonEditing,
            handleTableChange: handleCancellationReasonChange,
            toggleDeleteRow: toggleCancellationReasonDelete,
            toggleEditMode: toggleCancellationReasonEdit,
            getRowsToDelete: getCancellationReasonRowsToDelete,
            handleSave: handleCancellationReasonSave,
      } = useCancellationReasonTable();
      
      useEffect(() => {
            cancellationReasonStore.fetchCancellationReason();
      }, [cancellationReasonStore]);

      return (
            <main className={classes.layout__container}>
                  <div className={classes.content__block}>
                        <div className={classes.block__header}>
                              <h2>Запланированные матчи</h2>
                        </div>

                        <div className={classes.block__header}>
                              <h2>Завершенные матчи</h2>
                        </div>

                        <div className={classes.block__header}>
                              <h2>Отмененные матчи</h2>
                        </div>

                        <div className={classes.block__header}>
                              <h2>Неявки</h2>
                        </div>

                        <div className={classes.block__header}>
                              <h2>Причины отмены матчей</h2>
                              <Search />
                              <EditButton
                                    isEditing={isCancellationReasonEditing[cancellationReasonTableId]} 
                                    tableId={cancellationReasonTableId}
                                    onEdit={toggleCancellationReasonEdit} 
                                    onCancel={() => toggleCancellationReasonEdit(cancellationReasonTableId, false)}
                                    onSave={() => handleCancellationReasonSave(cancellationReasonTableId)}
                              />
                        </div>
                        <Table
                              config={cancellationReasonConfig} 
                              data={cancellation_reasons || []}
                              tableId={cancellationReasonTableId}
                              isEditing={isCancellationReasonEditing[cancellationReasonTableId]}
                              onToggleEdit={() => toggleCancellationReasonEdit(cancellationReasonTableId)}
                              onEditChange={(
                                    rowIndex: number, 
                                    updatedData
                              ) => handleCancellationReasonChange(cancellationReasonTableId, rowIndex, updatedData)}
                              onDeleteToggle={(tableId, rowIndex, rowData) => 
                                    toggleCancellationReasonDelete(tableId, rowIndex, rowData)
                              }
                              rowsToDelete={getCancellationReasonRowsToDelete(cancellationReasonTableId)}
                        />
                  </div>
            </main>
      );
};

export default observer(Matches);