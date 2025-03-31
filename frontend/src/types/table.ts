export interface TableColumn<T> {
      key: keyof T;
      title: string;
      editable?: boolean;
      type?: 'text' | 'select' | 'number';
      validator?: (value: any) => boolean;
      options?: Array<{
            value: any;
            label: string;
      }>;
      displayValue?: (rowData: T) => React.ReactNode;
      emptyValueText?: string;
}

export interface TableConfig<T> {
      columns: TableColumn<T>[];
      applyDelete: boolean;
}

export type TableProps<T extends Record<string, any>> = {
      config: TableConfig<T>;
      data: T[];
      tableId: string;
      isEditing: boolean;
      onEditChange: (rowIndex: number, updatedData: T) => void;
      onToggleEdit?: () => void;
      onRowClick?: (rowData: T) => void;
      onSave?: () => void;
      onDeleteToggle?: (tableId: string, rowIndex: number, rowData: Partial<T>) => void;
      rowsToDelete?: Record<number, Partial<T>>;
};