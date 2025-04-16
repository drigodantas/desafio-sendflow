import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { useEffect, useState } from 'react';
import { ConnectionDTO } from '../../../app/apps/connections/ConnectionService';

interface Props {
  connection: ConnectionDTO | null;
  onSubmit: (name: string) => void;
}

export function ModalConnections(props: Props) {
  const { connection, onSubmit } = props;

  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (connection) {
      setName(connection.name);
    } else {
      setName('');
    }
  }, [connection]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    onSubmit(name);
    setLoading(false);
  }

  return (
    <>
      <DialogTitle>
        {connection ? 'Editar Conexão' : 'Adicionar Conexão'}
      </DialogTitle>

      <DialogContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            className="p-2 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Button type="submit" variant="contained" loading={loading}>
            Salvar
          </Button>
        </form>
      </DialogContent>
    </>
  );
}
