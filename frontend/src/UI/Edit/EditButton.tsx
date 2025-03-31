import { FC } from 'react';
import editIcon from '../../assets/icons/edit.svg';
import checkIcon from '../../assets/icons/check.svg';
import closeIcon from '../../assets/icons/close.svg';
import classes from './EditButton.module.scss';

interface EditButtonProps {
     isEditing: boolean;
     tableId: string;
     onEdit: (tableId: string) => void;
     onSave: (tableId: string) => void;
     onCancel: (tableId: string) => void;
}

const EditButton: FC<EditButtonProps> = ({ isEditing, tableId, onEdit, onSave, onCancel }) => {
     return (
          <div className={`${classes.editButton} ${isEditing ? classes.editing : ''}`}>
               {isEditing ? (
                    <>
                         <button className={classes.actionButton} onClick={() => onSave(tableId)}>
                              <img src={checkIcon} alt="Сохранить" />
                         </button>
                         <button className={classes.actionButton} onClick={() => onCancel(tableId)}>
                              <img src={closeIcon} alt="Отменить" />
                         </button>
                    </>
               ) : (
                    <button className={classes.emptyButton} onClick={() => onEdit(tableId)}>
                         <img src={editIcon} alt="Изменить" />
                    </button>
               )}
          </div>
     );
};

export default EditButton;
