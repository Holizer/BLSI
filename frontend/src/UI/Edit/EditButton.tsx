import { FC } from 'react';
import editIcon from '../../assets/icons/edit.svg';
import checkIcon from '../../assets/icons/check.svg';
import closeIcon from '../../assets/icons/close.svg';
import classes from './EditButton.module.scss';

interface EditButtonProps {
    isEditing: boolean;
    onEdit: () => void;
    onCancel: () => void;
}

const EditButton: FC<EditButtonProps> = ({ isEditing, onEdit, onCancel }) => {
    return (
        <div className={`${classes.editButton} ${isEditing ? classes.editing : ''}`}>
            {isEditing ? (
                  <>
                        <button className={classes.actionButton} onClick={onEdit}>
                              <img src={checkIcon} alt="Сохранить" />
                        </button>
                        <button className={classes.actionButton} onClick={onCancel}>
                              <img src={closeIcon} alt="Отменить" />
                        </button>
                  </>
            ) : (
                  <button className={classes.emptyButton} onClick={onEdit}>
                        <img src={editIcon} alt="Изменить" />
                  </button>
            )}
        </div>
    );
};

export default EditButton;
