import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import classes from './Modal.module.scss';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div 
            className={`${classes.modal__overlay} ${isOpen ? classes.open : ''}`} 
            onClick={onClose}
        >
            <div 
                className={`${classes.modal__content} ${isOpen ? classes.open : ''}`} 
                onClick={(e) => e.stopPropagation()}
            >
                <button className={classes.modal__close} onClick={onClose}>×</button>
                {children}
            </div>
        </div>,
        document.body 
    );
};

export default Modal;