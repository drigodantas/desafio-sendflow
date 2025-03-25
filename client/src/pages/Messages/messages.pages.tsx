import {
  CircularProgress,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';

import type { MessageDTO } from '../../dtos/message.dto';
import { useMessages } from './hooks/useMessages.hooks';

export default function Messages() {
  const { filter, changeFilter, loading, messages } = useMessages();

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-xl">Mensagens</h1>
        <div className="flex gap-4 w-48">
          <TextField
            select
            fullWidth
            label="Filtrar por status"
            value={filter}
            onChange={(e) => changeFilter(e.target.value as string)}
            className="bg-gray-100"
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="scheduled">Agendadas</MenuItem>
            <MenuItem value="sent">Enviadas</MenuItem>
          </TextField>
        </div>
      </div>

      {loading ? (
        <CircularProgress size={'3rem'} />
      ) : (
        <Table>
          <TableHead>
            <TableRow className="bg-blue-500">
              <TableCell
                sx={{ color: 'white', fontWeight: 'bold', width: '50%' }}
              >
                Mensagem
              </TableCell>
              <TableCell
                sx={{ color: 'white', fontWeight: 'bold', width: '25%' }}
              >
                Data
              </TableCell>
              <TableCell
                sx={{ color: 'white', fontWeight: 'bold', width: '15%' }}
              >
                Status
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {messages?.map((message: MessageDTO) => (
              <TableRow key={message?.id} className="bg-gray-100">
                <TableCell>{message?.text}</TableCell>
                <TableCell>
                  {message?.send_date.toDate().toLocaleString('pt-BR')}
                </TableCell>
                <TableCell>
                  {message?.status === 'scheduled' ? 'Agendada' : 'Enviada'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
