import classes from './Table.module.scss';
import { TableProps } from '@/types/table';

const Table = <T extends Record<string, any>>({ config, data, onSave, isEditing, onToggleEdit }: TableProps<T>) => {
	const handleChange = (rowIndex: number, columnKey: keyof T, value: any) => {
	};

	const handleSave = () => {
		onSave(data);
	};

	return (
		<div className={classes.tableWrapper}>
			<table className={classes.table}>
				<thead>
					<tr>
						{config.columns.map((column) => (
						<th key={column.key.toString()}>{column.title}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((row, rowIndex) => (
						<tr key={rowIndex}>
							{config.columns.map((column) => (
							<td key={column.key.toString()}>
								{isEditing && column.editable ? (
								column.type === 'select' && column.options ? (
								<select
									value={row[column.key]}
									onChange={(e) => handleChange(rowIndex, column.key, e.target.value)}
								>
									{column.options.map((option) => (
									<option key={option} value={option}>
									{option}
									</option>
									))}
								</select>
								) : column.type === 'number' ? (
									<input
										type="number"
										value={row[column.key]}
										min={18}
										max={99}
										onChange={(e) => handleChange(rowIndex, column.key, Number(e.target.value))}
									/>
								) : (
									<input
										type="text"
										value={row[column.key]}
										maxLength={50}
										onChange={(e) => handleChange(rowIndex, column.key, e.target.value)}
									/>
								)
								) : (
									row[column.key]
								)}
							</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
