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
}

export interface TableConfig<T> {
      columns: TableColumn<T>[];
      applyDelete: boolean;
}

export type TableProps<T extends Record<string, any>> = {
      config: TableConfig<T>;
      data: T[];
      isEditing: boolean;
      onEditChange: (rowIndex: number, updatedData: T) => void;
      tableId: string;
      onToggleEdit?: () => void;
      onSave?: () => void;
      onRowClick?: (rowData: T) => void; 
};