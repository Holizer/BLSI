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
import { useCompletedMatchesTable } from '../configs/useCompletedMatchesTable';
import ModalOpenButton from '../UI/ModalOpenButton/ModalOpenButton';
import CreateCancellationReasonForm from '../components/CreateForm/CreateCancellationReasonForm';
import CreateMatchForm from '../components/CreateForm/CreateMatchForm';

const Matches = () => {
      const { cancellationReasonStore, matchStore } = useAppContext();
      const { cancellation_reasons } = cancellationReasonStore;
      const { scheduledMatches, canceledMatches, forfeitedMatches, complitedMathces } = matchStore;
      
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
            tableId: completedMatchesTableId,
            config: completedMatchesConfig, 
      } = useCompletedMatchesTable();

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
            const load = async () => {
                  await matchStore.fetchMatchStatusTypes();
                  await matchStore.fetchSheduledMactches();
                  await matchStore.fetchCanceledMactches();
                  await matchStore.fetchForfeitedMactches();
                  await matchStore.fetchCompletedMatches();
                  await cancellationReasonStore.fetchCancellationReason()
            }
            load();
      }, [cancellationReasonStore, matchStore]);

      return (
            <main className={classes.layout__container}>
                  <ModalOpenButton modalItem={ <CreateMatchForm/> } >
                        Въеби мне
                  </ModalOpenButton>
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
                        <Table
                              config={completedMatchesConfig} 
                              data={complitedMathces || []}
                              tableId={completedMatchesTableId}
                        />
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
                              <h2>Причины отмен матчей</h2>
                              <Search />
                              <EditButton
                                    isEditing={isCancellationReasonEditing[cancellationReasonTableId]} 
                                    tableId={cancellationReasonTableId}
                                    onEdit={toggleCancellationReasonEdit} 
                                    onCancel={() => toggleCancellationReasonEdit(cancellationReasonTableId, false)}
                                    onSave={() => handleCancellationReasonSave(cancellationReasonTableId)}
                              />
                              <ModalOpenButton modalItem={ <CreateCancellationReasonForm/> } >
                                    +
                              </ModalOpenButton>
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