import { FC } from 'react'
import editIcon from '../../assets/icons/edit.svg';
import classes from './EditButton.module.scss';

interface EditButtonProps {
      onClick: () => (void);
}

const EditButton: FC<EditButtonProps> = ({
      onClick
}) => {
      return (
            <button className={classes.editButton} onClick={onClick}>
                  <img src={editIcon} alt="" />
            </button>
      )
}

export default EditButton
