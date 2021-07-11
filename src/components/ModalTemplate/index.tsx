import React from 'react';
import { createPortal } from 'react-dom';
import { isJsxOpeningElement } from 'typescript';

interface IModalTemplateProps {
  isOpen: boolean;
  title: string;
  handleCloseButton: () => void
  handleSubmitButton: () => void
};

export const ModalTemplate: React.FC<IModalTemplateProps> = ({ isOpen, children, title, handleCloseButton, handleSubmitButton }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-wrapper">
      <div className="add-profile-modal_title"></div>
        <div className="modal"> 
            {children}
        </div>
        <div>
          <button onClick={handleCloseButton}>
            close
          </button>
          <button onClick={handleSubmitButton}>
            submit
          </button>
        </div>
    </div>,
    document.body
  );
};