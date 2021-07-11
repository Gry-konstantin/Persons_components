import React from 'react';
import { createPortal } from 'react-dom';
import './index.css';

interface IModalTemplateProps {
  isDisabledSubmitButton:boolean;
  isOpen: boolean;
  title: string;
  handleCloseButton: () => void
  handleSubmitButton: () => void
};

export const ModalTemplate: React.FC<IModalTemplateProps> = ({isDisabledSubmitButton, isOpen, children, title, handleCloseButton, handleSubmitButton }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className='overlay'>
      <div className='modal-wrapper'> 
          {children}
          <div className = 'modal__buttons'>
            <button className="btn" onClick={handleCloseButton}>
              Закрыть
            </button>
            <button disabled={isDisabledSubmitButton} className="btn btn_submit" onClick={handleSubmitButton}>
              Сохранить
            </button>
          </div>
      </div>
    </div>,
    document.body
  );
};