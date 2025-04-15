import { observer } from 'mobx-react-lite';
import classes from './../styles/layout.module.scss';
import Search from '../UI/Search/Search';
import EditButton from '../UI/Edit/EditButton';
import Table from '../UI/Table/Table';
import { useAppContext } from '../hooks/useAppContext';
import { useEffect, useMemo } from 'react';
import { useCancellationReasonTable } from '../configs/matches/useCancellationReasonTable';
import { useScheduledMatchesTable } from '../configs/matches/useScheduledMatchesTable';
import { useCanceledMatchesTable } from '../configs/matches/useCanceledMatchesTable';
import { useForfeitedMatchesTable } from '../configs/matches/useForfeitedMatchesTable';
import { useCompletedMatchesTable } from '../configs/matches/useCompletedMatchesTable';
import ModalOpenButton from '../UI/ModalOpenButton/ModalOpenButton';
import CreateCancellationReasonForm from '../components/CreateForm/CreateCancellationReasonForm';
import CreateMatchForm from '../components/CreateForm/CreateMatchForm';

const Matches = () => {
      const { cancellationReasonStore, matchStore, seasonStore } = useAppContext();
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
            const { selectedSeasonId, selectedWeekId } = seasonStore;
            
            if (selectedSeasonId) {
                matchStore.fetchCanceledMactches(selectedSeasonId, selectedWeekId)
                matchStore.fetchForfeitedMactches(selectedSeasonId, selectedWeekId)
                matchStore.fetchCompletedMatches(selectedSeasonId, selectedWeekId)
                matchStore.fetchSheduledMactches(selectedSeasonId, selectedWeekId)
            }
        }, [seasonStore.selectedSeasonId, seasonStore.selectedWeekId]);

      useEffect(() => {
            cancellationReasonStore.fetchCancellationReason()
      }, [cancellationReasonStore]);

      const memoizedScheduledMatchesTable = useMemo(() => (
            <Table
                  config={scheduledMatchesConfig} 
                  data={scheduledMatches || []}
                  tableId={scheduledMatchesTableId}
            />
      ), [scheduledMatches, scheduledMatchesConfig, scheduledMatchesTableId]);

      
      const memoizedCompletedMatchesTable = useMemo(() => (
            <Table
                  config={completedMatchesConfig} 
                  data={complitedMathces || []}
                  tableId={completedMatchesTableId}
            />
      ), [complitedMathces, completedMatchesConfig, completedMatchesTableId]);


      const memoizedCanceledMatchesTable = useMemo(() => (
            <Table
                  config={canceledMatchesConfig} 
                  data={canceledMatches || []}
                  tableId={canceledMatchesTableId}
            />
      ), [canceledMatches, canceledMatchesConfig, canceledMatchesTableId]);


      const memoizedForfeitedMatchesTable = useMemo(() => (
            <Table
                  config={forfeitedMatchesConfig} 
                  data={forfeitedMatches || []}
                  tableId={forfeitedMatchesTableId}
            />
      ), [forfeitedMatches, forfeitedMatchesConfig, forfeitedMatchesTableId]);

      return (
            <main className={classes.layout__container}>
                  <div className={classes.content__block}>
                        <div className={classes.block__header}>
                              <h2>Запланированные матчи</h2>
                              <Search />
                              <ModalOpenButton modalItem={ <CreateMatchForm initialStatusTypeId={1}/> } >
                                    +
                              </ModalOpenButton>
                        </div>
                        {memoizedScheduledMatchesTable}
                  </div>   

                  <div className={classes.content__block}>
                        <div className={classes.block__header}>
                              <h2>Завершенные матчи</h2>
                              <Search />
                              <ModalOpenButton modalItem={ <CreateMatchForm initialStatusTypeId={2}/> } >
                                    +
                              </ModalOpenButton>
                        </div>
                        {memoizedCompletedMatchesTable}
                  </div>

                  <div className={classes.content__block}>
                        <div className={classes.block__header}>
                              <h2>Отмененные матчи</h2>
                              <Search />
                              <ModalOpenButton modalItem={ <CreateMatchForm initialStatusTypeId={3}/> } >
                                    +
                              </ModalOpenButton>
                        </div>
                        {memoizedCanceledMatchesTable}
                  </div>

                  <div className={classes.content__block}>
                        <div className={classes.block__header}>
                              <h2>Матчи с неявками</h2>
                              <Search />
                              <ModalOpenButton modalItem={ <CreateMatchForm initialStatusTypeId={4}/> } >
                                    +
                              </ModalOpenButton>
                        </div>
                        {memoizedForfeitedMatchesTable}
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