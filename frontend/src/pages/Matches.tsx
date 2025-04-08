import { observer } from 'mobx-react-lite';
import classes from './../styles/layout.module.scss';
import Search from '../UI/Search/Search';
import EditButton from '../UI/Edit/EditButton';
import Table from '../UI/Table/Table';
import { useAppContext } from '../hooks/useAppContext';
import { useEffect } from 'react';
import { useCancellationReasonTable } from '../configs/useCancellationReasonTable';
import { useScheduledMatchesTable } from '../configs/useScheduledMatchesTable';

const Matches = () => {
      const { cancellationReasonStore, matchStore } = useAppContext();
      const { cancellation_reasons } = cancellationReasonStore;
      const { scheduledMatches } = matchStore;
      
      const {
            tableId: scheduledMatchesTableId,
            config: scheduledMatchesConfig, 
            isEditing: isScheduledMatchesEditing,
            handleTableChange: handleScheduledMatchesChange,
            toggleDeleteRow: toggleScheduledMatchesDelete,
            toggleEditMode: toggleScheduledMatchesEdit,
            getRowsToDelete: getScheduledMatchesRowsToDelete,
            // handleSave: handleScheduledMatchesSave,
      } = useScheduledMatchesTable();


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
            matchStore.fetchMatchStatusTypes();
            matchStore.fetchSheduledMacthes();
      }, [cancellationReasonStore]);

      return (
            <main className={classes.layout__container}>
                  <div className={classes.content__block}>
                        <div className={classes.block__header}>
                              <h2>Запланированные матчи</h2>
                              <Search />
                              {/* <EditButton
                                    isEditing={isScheduledMatchesEditing[scheduledMatchesTableId]} 
                                    tableId={scheduledMatchesTableId}
                                    onEdit={toggleScheduledMatchesEdit} 
                                    onCancel={() => toggleScheduledMatchesEdit(scheduledMatchesTableId, false)}
                                    onSave={() => handleScheduledMatchesSave(scheduledMatchesTableId)}
                              /> */}
                        </div>
                        <Table
                              config={scheduledMatchesConfig} 
                              data={scheduledMatches || []}
                              tableId={scheduledMatchesTableId}
                              isEditing={isScheduledMatchesEditing[scheduledMatchesTableId]}
                              onToggleEdit={() => toggleScheduledMatchesEdit(scheduledMatchesTableId)}
                              onEditChange={(rowIndex, updatedData) => 
                                    handleScheduledMatchesChange(scheduledMatchesTableId, rowIndex, updatedData)
                              }
                              onDeleteToggle={(tableId, rowIndex, rowData) => 
                                    toggleScheduledMatchesDelete(tableId, rowIndex, rowData)
                              }
                              rowsToDelete={getScheduledMatchesRowsToDelete(scheduledMatchesTableId)}
                        />
                  </div>   

                  <div className={classes.content__block}>
                        <div className={classes.block__header}>
                              <h2>Завершенные матчи</h2>
                        </div>
                  </div>


                  <div className={classes.content__block}>
                        <div className={classes.block__header}>
                              <h2>Отмененные матчи</h2>
                        </div>
                  </div>

                  <div className={classes.content__block}>
                        <div className={classes.block__header}>
                              <h2>Неявки</h2>
                        </div>
                  </div>

                  <div className={classes.content__block}>
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