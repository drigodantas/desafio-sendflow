import { Alert, Button, MenuItem, Snackbar, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import type { AlertDTO } from '../../dtos/alert.dto';
import { auth, db } from '../../firebase';
import { useConnections } from '../Connections/hooks/useConnections.hooks';
import { useContacts } from '../Contacts/hooks/useContacts.hooks';

export default function ScheduleMessages() {
  const { connections } = useConnections();
  const { contacts } = useContacts();

  const [message, setMessage] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<string[]>([]);
  const [sendDate, setSendDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertDTO | null>(null);

  function handleAlert(message: string, severity: 'success' | 'error') {
    setAlert({ message, severity });
  }

  function handleCloseAlert() {
    setAlert(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    if (!message || selectedContacts.length === 0 || !sendDate) {
      handleAlert('Preencha todos os campos!', 'error');
      setLoading(false);
      return;
    }

    if (dayjs(sendDate).isBefore(dayjs())) {
      handleAlert('A data e horário devem ser no futuro!', 'error');
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'messages'), {
        text: message,
        send_date: Timestamp.fromDate(dayjs(sendDate).toDate()),
        contacts_id: selectedContacts,
        status: 'scheduled',
        user_id: auth.currentUser?.uid,
        connection: selectedConnection,
        created_at: Timestamp.fromDate(new Date()),
        updated_at: Timestamp.fromDate(new Date()),
      });

      handleAlert('Mensagem agendada com sucesso!', 'success');

      setMessage('');
      setSendDate('');
      setSelectedConnection([]);
      setSelectedContacts([]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      handleAlert('Erro ao agendar mensagem!', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="font-bold text-xl">Agendar Mensagens</h1>
      <form
        className="flex flex-col gap-4 bg-gray-100 p-4 rounded-lg"
        onSubmit={handleSubmit}
      >
        <TextField
          multiline
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          required
          label="Mensagem"
        />

        <TextField
          type="datetime-local"
          value={sendDate}
          onChange={(e) => setSendDate(e.target.value)}
          fullWidth
          required
          error={dayjs(sendDate).isBefore(dayjs())}
          helperText={
            dayjs(sendDate).isBefore(dayjs()) ? 'Horário inválido' : ''
          }
        />

        <TextField
          select
          label="Selecionar Conexão"
          fullWidth
          SelectProps={{
            value: selectedConnection,
            onChange: (e) => setSelectedConnection(e.target.value as string[]),
          }}
          error={selectedConnection.length === 0}
          helperText={
            selectedConnection.length === 0
              ? 'Selecione ao menos uma conexão'
              : ''
          }
        >
          {connections.map((connection) => (
            <MenuItem key={connection.id} value={connection.id}>
              {connection.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Selecionar Contatos"
          fullWidth
          SelectProps={{
            multiple: true,
            value: selectedContacts,
            onChange: (e) => setSelectedContacts(e.target.value as string[]),
          }}
          error={selectedContacts.length === 0}
          helperText={
            selectedContacts.length === 0 ? 'Selecione ao menos um contato' : ''
          }
        >
          {contacts.map((contact) => (
            <MenuItem key={contact.id} value={contact.id}>
              {contact.name}
            </MenuItem>
          ))}
        </TextField>

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          loading={loading}
        >
          Enviar
        </Button>
      </form>

      {alert ? (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          onClose={handleCloseAlert}
        >
          <Alert onClose={handleCloseAlert} severity={alert.severity}>
            {alert.message}
          </Alert>
        </Snackbar>
      ) : null}
    </div>
  );
}
