import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Input from '@mui/material/Input';
import { useEffect, useState } from 'react';
import { ContactDTO } from '../../../services/ContactsService';

interface ContactsModalProps {
  open: boolean;
  onClose: () => void;
  contact: ContactDTO | null;
  onSubmit: (name: string, number: string) => void;
}

export default function ModalContacts(props: ContactsModalProps) {
  const { open, onClose, contact, onSubmit } = props;
  const [name, setName] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setNumber(contact.number);
    } else {
      setName('');
      setNumber('');
    }
  }, [contact]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    onSubmit(name, number);
    setLoading(false);
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {contact ? 'Editar Contato' : 'Adicionar Contato'}
      </DialogTitle>
      <DialogContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Nome"
            className="p-2 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            type="text"
            placeholder="Telefone ex: 5511999999999"
            className="p-2 border rounded-md"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
            inputProps={{
              maxLength: 15,
              inputMode: 'numeric',
            }}
          />

          <Button type="submit" variant="contained" loading={loading}>
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
