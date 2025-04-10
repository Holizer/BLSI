import { useCallback } from 'react';
import { ICancellationReason } from '@/models/ICancellationReason';
import { useAppContext } from '../hooks/useAppContext';
import { useTableConfig } from '../hooks/useTableConfig';
import useTableManager from '../hooks/useTableManager';

export const useCancellationReasonTable = () => {
    const tableId = 'cancellation-reason-table';
    const { cancellationReasonStore } = useAppContext();
    
    const tableConfig = useTableConfig<ICancellationReason>(() => ({
            applyDelete: true,
            columns: [
                { 
                    key: 'reason', 
                    title: 'Причина отмены матча', 
                    editable: true, 
                    type: 'text', 
                    maxLength: 200 
                },
            ],
    }));

    const {
        isEditing,
        handleTableChange,
        toggleDeleteRow,
        toggleEditMode,
        resetTableState,
        getRowsToDelete,
        getRowsToEdit,
    } = useTableManager<ICancellationReason>();

    const handleSave = useCallback(async (tableId: string) => {
        try {
            const rowsToEdit = getRowsToEdit(tableId);
            const rowsToDelete = getRowsToDelete(tableId);

            if (Object.keys(rowsToEdit).length === 0 && Object.keys(rowsToDelete).length === 0) {
                resetTableState(tableId);
                return;
            }

            await Promise.all([
                ...Object.values(rowsToEdit).map(changes => 
                cancellationReasonStore.updateCancellationReason(changes as ICancellationReason)
                ),
                ...Object.values(rowsToDelete).map((deleted) =>
                deleted.cancellation_reason_id 
                    ? cancellationReasonStore.deleteCancellationReason(deleted.cancellation_reason_id) 
                    : Promise.resolve()
                )
            ]);
            
            await cancellationReasonStore.fetchCancellationReason();
            resetTableState(tableId);
        } catch (error) {
            console.error("Ошибка при сохранении:", error);
            throw error;
        }
    }, [cancellationReasonStore, getRowsToDelete, getRowsToEdit, resetTableState]);

    return {
        tableId,
        config: {
            columns: tableConfig.columns,
            applyDelete: tableConfig.applyDelete,
        },
        isEditing,
        handleTableChange,
        toggleDeleteRow,
        toggleEditMode,
        resetTableState,
        getRowsToDelete,
        getRowsToEdit,
        handleSave,
        applyDelete: tableConfig.applyDelete,
    };
};