import { useState, ReactNode } from 'react';
import Modal from './../Modal/Modal';
import classes from './ModalOpenButton.module.scss';

interface ModalOpenButtonProps {
  modalItem: ReactNode;
  children: ReactNode;
}

const ModalOpenButton: React.FC<ModalOpenButtonProps> = ({ 
  modalItem, 
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className={classes.modal__open_button}
            >
                {children}
            </button>

            <Modal 
                isOpen={isOpen} 
                onClose={() => setIsOpen(false)}
            >
                {modalItem}
            </Modal>
        </>
    );
};

export default ModalOpenButton;