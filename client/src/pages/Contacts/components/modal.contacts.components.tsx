import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Input,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { ContactDTO } from '../../../dtos/contact.dto';

interface ContactsModalProps {
  open: boolean;
  onClose: () => void;
  contact: ContactDTO | null;
  onSubmit: (name: string, number: string) => void;
}

export default function ModalContacts({
  open,
  onClose,
  contact,
  onSubmit,
}: ContactsModalProps) {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);

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
