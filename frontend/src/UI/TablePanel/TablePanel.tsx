// import { TableConfig } from "../../types/table";
// import EditButton from "../Edit/EditButton";
// import Search from "../Search/Search";
// import Table from "../Table/Table";
// import classes from "./TablePanel.module.scss";

// type TableActionHandlers<T> = {
//      onEditToggle: (tableId: string) => void;
//      onEditChange: (rowIndex: number, updatedData: T) => void;
//      onCancel: () => void;
//      onSave: () => void;
//      onDeleteToggle: (tableId: string, rowIndex: number, rowData: T) => void;
// };

// interface TablePanelProps<T extends Record<string, any>> extends TableActionHandlers<T> {
//      title: string;
//      tableId: string;
//      config: TableConfig<T>;
//      data: T[];
//      isEditing: boolean;
//      rowsToDelete: Record<number, Partial<T>>;
//      searchComponent?: React.ReactNode;
//      className?: string; onDeleteToggle: (tableId: string, rowIndex: number, rowData: Partial<T>) => void;
// }

// const TablePanel = <T extends Record<string, any>>({
//   title,
//   tableId,
//   config,
//   data,
//   isEditing,
//   rowsToDelete,
//   searchComponent = <Search />,
//   className = "",
//   ...actionHandlers
// }: TablePanelProps<T>) => {
//   return (
//     <div className={`${classes.table__panel} ${className}`}>
//       <div className={classes.table__header}>
//         <h2 className={classes.table__title}>{title}</h2>
//         <div className={classes.table__controls}>
//           {searchComponent}
//           <EditButton
//             isEditing={isEditing}
//             tableId={tableId}
//             onEdit={() => actionHandlers.onEditToggle(tableId)}
//             onCancel={actionHandlers.onCancel}
//             onSave={actionHandlers.onSave}
//           />
//         </div>
//       </div>
      
//       <Table<T>
//         config={config}
//         data={data}
//         tableId={tableId}
//         isEditing={isEditing}
//         onToggleEdit={() => actionHandlers.onEditToggle(tableId)}
//         onEditChange={actionHandlers.onEditChange}
//         onDeleteToggle={actionHandlers.onDeleteToggle}
//         rowsToDelete={rowsToDelete}
//       />
//     </div>
//   );
// };

// export default TablePanel;