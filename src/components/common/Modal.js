// src/components/common/Modal.js
import React, { useEffect } from 'react';

export const Modal = ({ children, onClose, fullWidth = false, maxWidth = '500px', fixedHeight = false, highZIndex = false }) => {
  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // モーダル外クリックで閉じる
  const handleOutsideClick = (e) => {
    if (e.target.className === 'modal') {
      onClose();
    }
  };

  return (
    <div 
      className="modal" 
      style={{ 
        display: 'flex',
        zIndex: highZIndex ? 1100 : 1000 
      }} 
      onClick={handleOutsideClick}
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={
          fullWidth 
            ? { maxWidth: maxWidth, width: '90%', maxHeight: '90vh', overflowY: 'auto' }
            : fixedHeight
              ? { maxHeight: '550px', overflowY: 'hidden' }
              : {}
        }
      >
        {children}
      </div>
    </div>
  );
};