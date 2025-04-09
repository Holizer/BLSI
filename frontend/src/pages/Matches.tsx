import { observer } from 'mobx-react-lite';
import classes from './../styles/layout.module.scss';
import Search from '../UI/Search/Search';
import EditButton from '../UI/Edit/EditButton';
import Table from '../UI/Table/Table';
import { useAppContext } from '../hooks/useAppContext';
import { useEffect } from 'react';
import { useCancellationReasonTable } from '../configs/useCancellationReasonTable';
import { useScheduledMatchesTable } from '../configs/useScheduledMatchesTable';
import { useCanceledMatchesTable } from '../configs/useCanceledMatchesTable';
import { useForfeitedMatchesTable } from '../configs/useForfeitedMatchesTable';

const Matches = () => {
      const { cancellationReasonStore, matchStore } = useAppContext();
      const { cancellation_reasons } = cancellationReasonStore;
      const { scheduledMatches, canceledMatches, forfeitedMatches } = matchStore;
      
      const {
            tableId: scheduledMatchesTableId,
            config: scheduledMatchesConfig, 
      } = useScheduledMatchesTable();

      const {
            tableId: canceledMatchesTableId,
            config: canceledMatchesConfig, 
      } = useCanceledMatchesTable();

      const {
            tableId: forfeitedMatchesTableId,
            config: forfeitedMatchesConfig, 
      } = useForfeitedMatchesTable();

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
            matchStore.fetchCanceledMacthes();
            matchStore.fetchForfeitedMacthes();
      }, [cancellationReasonStore]);

      return (
            <main className={classes.layout__container}>
                  <div className={classes.content__block}>
                        <div className={classes.block__header}>
                              <h2>Запланированные матчи</h2>
                              <Search />
                        </div>
                        <Table
                              config={scheduledMatchesConfig} 
                              data={scheduledMatches || []}
                              tableId={scheduledMatchesTableId}
                        />
                  </div>   

                  <div className={classes.content__block}>
                        <div className={classes.block__header}>
                              <h2>Завершенные матчи</h2>
                              <Search />
                        </div>
                  </div>


                  <div className={classes.content__block}>
                        <div className={classes.block__header}>
                              <h2>Отмененные матчи</h2>
                              <Search />
                        </div>
                        <Table
                              config={canceledMatchesConfig} 
                              data={canceledMatches || []}
                              tableId={canceledMatchesTableId}
                        />
                  </div>

                  <div className={classes.content__block}>
                        <div className={classes.block__header}>
                              <h2>Матчи с неявками</h2>
                              <Search />
                        </div>
                        <Table
                              config={forfeitedMatchesConfig} 
                              data={forfeitedMatches || []}
                              tableId={forfeitedMatchesTableId}
                        />
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