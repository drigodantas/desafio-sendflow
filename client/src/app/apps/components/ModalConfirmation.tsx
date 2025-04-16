import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface ModalConfirmationProps {
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export function ModalConfirmation(props: ModalConfirmationProps) {
  const { onClose, onConfirm, title, message } = props;

  return (
    <>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="primary">
          Confirmar
        </Button>
      </DialogActions>
    </>
  );
}
