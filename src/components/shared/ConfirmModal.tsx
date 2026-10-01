import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Icon } from './Icon';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Onayla',
  cancelText = 'İptal',
  isDestructive = false,
  isLoading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-500' : 'bg-primary-light/20 text-primary'}`}>
          <Icon name={isDestructive ? 'error' : 'info'} size={32} />
        </div>
        
        <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-sm">
          {message}
        </p>
        
        <div className="flex w-full gap-3 mt-4">
          <Button 
            variant="outline" 
            fullWidth 
            onClick={onClose} 
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button 
            variant={isDestructive ? 'danger' : 'primary'} 
            fullWidth 
            onClick={onConfirm} 
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
