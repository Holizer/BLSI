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
import { useTableSearch } from '../hooks/useTableSearch';

const Matches = () => {
      const { cancellationReasonStore, matchStore, seasonStore } = useAppContext();
      const { cancellation_reasons } = cancellationReasonStore;
      const { scheduledMatches, canceledMatches, forfeitedMatches, complitedMathces } = matchStore;
      
      //#region CONFIGS
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
      //#endregion

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

      //#region FILTERS AND TABLES
      const { handleSearch, getFilteredData } = useTableSearch(); 

      const filteredCancellationReasons = getFilteredData(cancellationReasonTableId, cancellation_reasons, cancellationReasonConfig);    
      
      const filteredScheduledMatches = getFilteredData(scheduledMatchesTableId, scheduledMatches, scheduledMatchesConfig); 
      const memoizedScheduledMatchesTable = useMemo(() => (
            <Table
            config={scheduledMatchesConfig} 
            data={filteredScheduledMatches || []}
            tableId={scheduledMatchesTableId}
            />
      ), [scheduledMatches, scheduledMatchesConfig, scheduledMatchesTableId]);
      
      
      const filteredCompletedMatches = getFilteredData(completedMatchesTableId, complitedMathces, completedMatchesConfig);    
      const memoizedCompletedMatchesTable = useMemo(() => (
            <Table
                  config={completedMatchesConfig} 
                  data={filteredCompletedMatches || []}
                  tableId={completedMatchesTableId}
            />
      ), [complitedMathces, completedMatchesConfig, completedMatchesTableId]);

      const filteredCanceledMatches= getFilteredData(canceledMatchesTableId, canceledMatches, canceledMatchesConfig);    
      const memoizedCanceledMatchesTable = useMemo(() => (
            <Table
                  config={canceledMatchesConfig} 
                  data={filteredCanceledMatches || []}
                  tableId={canceledMatchesTableId}
            />
      ), [canceledMatches, canceledMatchesConfig, canceledMatchesTableId]);

      const filteredForfeitedMatches = getFilteredData(forfeitedMatchesTableId, forfeitedMatches, forfeitedMatchesConfig);    
      const memoizedForfeitedMatchesTable = useMemo(() => (
            <Table
                  config={forfeitedMatchesConfig} 
                  data={filteredForfeitedMatches || []}
                  tableId={forfeitedMatchesTableId}
            />
      ), [forfeitedMatches, forfeitedMatchesConfig, forfeitedMatchesTableId]);
      //#endregion

      return (
            <main className={classes.layout__container}>
                  <div className={classes.content__block}>
                        <div className={classes.block__header}>
                              <h2>Запланированные матчи</h2>
                              <Search tableId={scheduledMatchesTableId} onSearch={handleSearch} />
                              <ModalOpenButton modalItem={ <CreateMatchForm initialStatusTypeId={1}/> } >
                                    +
                              </ModalOpenButton>
                        </div>
                        {memoizedScheduledMatchesTable}
                  </div>   

                  <div className={classes.content__block}>
                        <div className={classes.block__header}>
                              <h2>Завершенные матчи</h2>
                              <Search tableId={completedMatchesTableId} onSearch={handleSearch} />
                              <ModalOpenButton modalItem={ <CreateMatchForm initialStatusTypeId={2}/> } >
                                    +
                              </ModalOpenButton>
                        </div>
                        {memoizedCompletedMatchesTable}
                  </div>

                  <div className={classes.content__block}>
                        <div className={classes.block__header}>
                              <h2>Отмененные матчи</h2>
                              <Search tableId={canceledMatchesTableId} onSearch={handleSearch} />
                              <ModalOpenButton modalItem={ <CreateMatchForm initialStatusTypeId={3}/> } >
                                    +
                              </ModalOpenButton>
                        </div>
                        {memoizedCanceledMatchesTable}
                  </div>

                  <div className={classes.content__block}>
                        <div className={classes.block__header}>
                              <h2>Матчи с неявками</h2>
                              <Search tableId={forfeitedMatchesTableId} onSearch={handleSearch} />
                              <ModalOpenButton modalItem={ <CreateMatchForm initialStatusTypeId={4}/> } >
                                    +
                              </ModalOpenButton>
                        </div>
                        {memoizedForfeitedMatchesTable}
                  </div>

                  <div className={classes.content__block}>
                        <div className={classes.block__header}>
                              <h2>Причины отмен матчей</h2>
                              <Search tableId={cancellationReasonTableId} onSearch={handleSearch} />
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
                              data={filteredCancellationReasons || []}
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