import { useEffect, useState } from 'react';
import classes from './Table.module.scss';
import { TableProps } from '@/types/table';
import deleteIcon from '../../assets/icons/delete.png'
import Input from '../Input/Input';

const Table = <T extends Record<string, any>>({
	config,
	data,
	isEditing,
	onEditChange,
	tableId,
	onRowClick,
	onDeleteToggle,
	rowsToDelete = {},
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

	const handleDelete = (rowIndex: number, rowData: T) => {
		if (onDeleteToggle) {
			onDeleteToggle(tableId, rowIndex, rowData);
		}
	};

	const handleRowClick = (rowData: T) => {
		if (onRowClick) {
			onRowClick(rowData);
		}
	};

	useEffect(() => {
		if(!isEditing) {
			setEditedData({});
		}
	}, [isEditing])
	 
	return (
		<div className={classes.tableWrapper}>
			<div className={classes.scrollbar}>
				<div className={classes.scrollbar_thumb}></div>
    			</div>
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
					{data.map((row, rowIndex) => {
						
						const isRowMarkedForDeletion = rowsToDelete[rowIndex] !== undefined;
					
						return (
							<tr 
								key={rowIndex} 
								onClick={() => handleRowClick(row)}
								className={isRowMarkedForDeletion ? classes.rowMarkedForDeletion : ''}
							>
								{config.columns.map((column) => (
								<td key={column.key.toString()}>
									{isEditing && column.editable ? (
										column.type === 'select' && column.options ? (
										<div className={classes.select__wrapper}>
											<select
												value={
													editedData[rowIndex]?.[column.key] !== undefined 
													? editedData[rowIndex]?.[column.key] ?? ""
													: row[column.key] !== null ? row[column.key] : ""
												}
												onChange={(e) => {
													const value = e.target.value === "" ? null : e.target.value;
													handleChange(rowIndex, column.key, value);
												}}
											>
												<option value="">{column.emptyValueText || 'Не выбрано'}</option>
												{column.options.map((option) => (
													<option key={option.value} value={option.value}>
														{option.label}
													</option>
												))}
											</select>
										</div>
										
										) : column.type === 'number' ? (
											<Input
												type="number"
												value={editedData[rowIndex]?.[column.key] ?? row[column.key]}
												onChange={(e) => handleChange(rowIndex, column.key, Number(e.target.value))}
												onKeyDown={(e) => {
													if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {
														e.preventDefault();
													}
													if (['-', '+', 'e', 'E', '.'].includes(e.key)) {
													    e.preventDefault();
													}
												}}
												maxLength={column.maxLength}
												min={column.min} 
												max={column.max} 
											/>
										) : (
											<Input
												type="text"
												value={editedData[rowIndex]?.[column.key] ?? row[column.key]}
												onChange={(e) => handleChange(rowIndex, column.key, e.target.value)}
												maxLength={column.maxLength}
											/>
											)
										) : (
											column.displayValue 
											? column.displayValue(row) 
											: (row[column.key] == null ? (column.emptyValueText || 'Не указано') : row[column.key])
									)}
								</td>
								))}
								{isEditing && config.applyDelete === true && (
									<td onClick={(e) => e.stopPropagation()}>
										<button 
											onClick={() => handleDelete(rowIndex, row)} 
											className={classes.deleteButton}
										>
											<img src={deleteIcon} alt='Удалить'/>
										</button>
									</td>
								)}
							</tr>
						);
						
					})}
				</tbody>
		   </table>
	    </div>
	);
};

export default Table;
