import { useState } from 'react';
import classes from './Table.module.scss';
import { TableProps } from '@/types/table';
import deleteIcon from '../../assets/icons/delete.png'

const Table = <T extends Record<string, any>>({
	config,
	data,
	isEditing,
	onEditChange,
	tableId,
	onToggleEdit,
	onSave,
	onRowClick,
}: TableProps<T>) => {
	const [editedData, setEditedData] = useState<Record<number, Partial<T>>>({});
   
	const handleChange = (rowIndex: number, columnKey: keyof T, value: any) => {
		const newData = {
			...editedData,
			[rowIndex]: {
				...(editedData[rowIndex] || {}),
				[columnKey]: value,
			},
		};
		   
		setEditedData(newData);

		onEditChange(
			rowIndex,
			{ ...data[rowIndex], ...newData[rowIndex] }
		);
	};

	const handleDelete = (rowIndex: number) => {
	};

	const handleRowClick = (rowData: T) => {
		if (onRowClick) {
			onRowClick(rowData);
		}
	};
	 
	return (
		<div className={classes.tableWrapper}>
			<table className={classes.table}>
				<thead>
					<tr>
						{config.columns.map((column) => (
							<th key={column.key.toString()}>{column.title}</th>
						))}
						{config.applyDelete && isEditing && (
							<th>Действие</th>
						)}
					</tr>
				</thead>
				<tbody>
					{data.map((row, rowIndex) => (
					<tr 
						key={rowIndex} 
						onClick={() => handleRowClick(row)}
					>
					     {config.columns.map((column) => (
							<td key={column.key.toString()}>
								{isEditing && column.editable ? (
									column.type === 'select' && column.options ? (
									<select
										value={editedData[rowIndex]?.[column.key] ?? row[column.key]}
										onChange={(e) => handleChange(rowIndex, column.key, Number(e.target.value))}
									>
										{column.options.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
									) : column.type === 'number' ? (
										<input
											type="number"
											value={editedData[rowIndex]?.[column.key] ?? row[column.key]}
											onChange={(e) =>
												handleChange(rowIndex, column.key, Number(e.target.value))
											}
										/>
									) : (
										<input
											type="text"
											value={editedData[rowIndex]?.[column.key] ?? row[column.key]}
											onChange={(e) => handleChange(rowIndex, column.key, e.target.value)}
										/>
									)
								) : (
									column.displayValue 
									? column.displayValue(row) 
									: row[column.key]
								)}
						   	</td>
						))}
						{isEditing && config.applyDelete === true && (
							<td onClick={() => handleRowClick(row)} >
								<button onClick={() => handleDelete(rowIndex)} className={classes.deleteButton}>
									<img src={deleteIcon} alt='Удалить'/>
								</button>
							</td>
						)}
					</tr>
				 	))}
			  </tbody>
		   </table>
	    </div>
	);
};

export default Table;
