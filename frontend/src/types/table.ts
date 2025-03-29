export interface TableColumn<T> {
      key: keyof T;
      title: string;
      editable?: boolean;
      type?: 'text' | 'select' | 'number';
      options?: string[];
      validator?: (value: any) => boolean;
}

export interface TableConfig<T> {
      model: string;
      columns: TableColumn<T>[];
}

export interface TableProps<T> {
	config: TableConfig<T>;
	data: T[];
	onSave: (updatedData: T[]) => void;
	isEditing: boolean;
	onToggleEdit: () => void;
}