import DeleteIcon from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { useConnections } from '../../apps/connections/useConnections';

export default function ConnectionsPage() {
  const {
    connections,
    loading,
    alert,
    handleCloseAlert,
    handleOpenModal,
    handleOpenModalConfirmation,
  } = useConnections();

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-xl">Conexões</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal(null)}
        >
          Adicionar conexão
        </Button>
      </div>

      {loading ? (
        <CircularProgress size={'3rem'} />
      ) : (
        <Table>
          <TableHead>
            <TableRow className="bg-blue-500">
              <TableCell
                key={'name'}
                sx={{ color: 'white', fontWeight: 'bold', width: '85%' }}
              >
                Nome
              </TableCell>
              <TableCell
                key={'manage'}
                sx={{ color: 'white', fontWeight: 'bold' }}
              >
                Gerenciar
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {connections.map((connection) => (
              <TableRow key={connection.id} className="bg-gray-100">
                <TableCell>{connection.name}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenModal(connection)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleOpenModalConfirmation(connection)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {alert ? (
        <Snackbar
          open={alert ? true : false}
          autoHideDuration={3000}
          onClose={handleCloseAlert}
        >
          <Alert onClose={handleCloseAlert} severity={alert?.severity}>
            {alert?.message}
          </Alert>
        </Snackbar>
      ) : null}
    </div>
  );
}
