import { useState } from 'react';

const useTableManager = <T,>() => {
     const [editedRows, setEditedRows] = useState<{
          [tableId: string]: Record<number, Partial<T>>;
     }>({});
     
     const [rowsToDelete, setRowsToDelete] = useState<{
          [tableId: string]: Record<number, Partial<T>>;
     }>({});

     const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});

     const handleTableChange = <T,>(
          tableId: string,
          rowIndex: number,
          updatedData: T
     ) => {
          setEditedRows(prev => ({
               ...prev,
               [tableId]: {
                    ...(prev[tableId] || {}),
                    [rowIndex]: {
                         ...(prev[tableId]?.[rowIndex] || {}),
                         ...updatedData
                    }
               }
          }));
          setRowsToDelete(prev => ({
               ...prev,
          }))
     };

     const toggleEditMode = (tableId: string, state?: boolean) => {
          const newState = state !== undefined ? state : !isEditing[tableId];
          
          setIsEditing(prev => ({
               ...prev,
               [tableId]: newState
          }));

          if (newState === false) {
               resetTableState(tableId);
          }
     };

     const toggleDeleteRow = (tableId: string, rowIndex: number, rowData: Partial<T>) => {
          setRowsToDelete(prev => {
               const currentTableDeletions = prev[tableId] || {};
               const newTableDeletions = currentTableDeletions[rowIndex]
                    ? (() => {
                         const { [rowIndex]: _, ...rest } = currentTableDeletions; 
                         return rest;
                    })() : { ...currentTableDeletions, [rowIndex]: rowData };
               return {
                    ...prev,
                    [tableId]: newTableDeletions
               };
          });
     };
      

     const resetTableState = (tableId: string) => {
          setEditedRows(prev => {
               const newData = { ...prev };
               delete newData[tableId];
               return newData;
          });
          setRowsToDelete(prev => {
               const newData = { ...prev };
               delete newData[tableId];
               return newData;
          });
          setIsEditing(prev => ({ ...prev, [tableId]: false }));
     };

     const getRowsToEdit = (tableId: string) => {
          return editedRows[tableId] || [];
     };

     const getRowsToDelete = (tableId: string) => {
          return rowsToDelete[tableId] || [];
     };

     return {
          isEditing,
          handleTableChange,
          toggleEditMode,
          resetTableState,
          toggleDeleteRow,
          getRowsToEdit,
          getRowsToDelete
     };
};

export default useTableManager;