import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';
import { useTranslateFiles } from 'utils/translation';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onConfirm: () => void;
  loading?: boolean;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const { open, onClose, title, content, onConfirm, loading } = props;

  const { dialog: dialogTranslation } = useTranslateFiles('dialog');

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: 600, color: 'text.primary' }}>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ color: 'text.primary' }}>{content}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button color="inherit" size="large" disabled={!!loading} onClick={onClose}>
          {dialogTranslation.button.cancel}
        </Button>

        <Button
          variant="contained"
          color="error"
          size="large"
          disabled={!!loading}
          autoFocus
          startIcon={!!loading && <CircularProgress size={20} color="error" />}
          onClick={onConfirm}
        >
          {dialogTranslation.button.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
}