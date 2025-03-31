import { useState } from 'react';

const useTableManager = <T,>() => {
     const [editedRows, setEditedRows] = useState<{
          [tableId: string]: Record<number, Partial<T>>;
     }>({});
     
     const [rowsToDelete, setRowsToDelete] = useState<number[]>([]);
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
     };

     const toggleEditMode = (tableId: string, state?: boolean) => {
          setIsEditing(prev => ({
               ...prev,
               [tableId]: state !== undefined ? state : !prev[tableId]
          }));
     };

     const handleDeleteRow = (rowIndex: number) => {
          setRowsToDelete(prev => 
               prev.includes(rowIndex) 
               ? prev.filter(id => id !== rowIndex) 
               : [...prev, rowIndex]
          );
     };

     const resetTableState = (tableId: string) => {
          setEditedRows(prev => {
               const newData = { ...prev };
               delete newData[tableId];
               return newData;
          });
          setRowsToDelete([]);
          setIsEditing(prev => ({ ...prev, [tableId]: false }));
     };

     return {
          editedRows,
          rowsToDelete,
          isEditing,
          handleTableChange,
          toggleEditMode,
          handleDeleteRow,
          resetTableState
     };
};

export default useTableManager;