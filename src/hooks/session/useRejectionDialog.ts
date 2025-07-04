import { useState } from 'react';

interface RejectionDialogState {
  isOpen: boolean;
  sessionId: string;
  onClose: () => void;
}

export const useRejectionDialog = () => {
  const [dialogState, setDialogState] = useState<RejectionDialogState>({
    isOpen: false,
    sessionId: '',
    onClose: () => {},
  });
  const [rejectionReason, setRejectionReason] = useState('');

  const handleOpenDialog = (sessionId: string) => {
    setDialogState({
      isOpen: true,
      sessionId,
      onClose: handleCloseDialog,
    });
  };

  const handleCloseDialog = () => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
    setRejectionReason('');
  };

  return {
    dialogState,
    rejectionReason,
    setRejectionReason,
    handleOpenDialog,
    handleCloseDialog,
  };
};