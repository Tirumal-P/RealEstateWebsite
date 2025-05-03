import React, { useEffect } from 'react';

const Modal = ({ title, children, footer, onClose }) => {
  useEffect(() => {
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    // Add event listener for ESC key
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  // Close modal when clicking on backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      role="dialog" 
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button 
              type="button" 
              className="btn-close" 
              aria-label="Close" 
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          {footer && (
            <div className="modal-footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;