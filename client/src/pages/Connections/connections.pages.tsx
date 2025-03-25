import { Edit } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { ModalConfirmation } from '../../components';
import { ModalConnections } from './components/modal.connections.components';
import { useConnections } from './hooks/useConnections.hooks';

export default function ConnectionsPage() {
  const {
    connections,
    loading,
    confirmation,
    alert,
    handleCloseAlert,
    handleCloseModal,
    handleCloseModalConfirmation,
    handleOpenModal,
    handleOpenModalConfirmation,
    open,
    selected,
    handleDeleteConnection,
    handleSaveConnection,
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

      {open ? (
        <ModalConnections
          open={open}
          onClose={() => handleCloseModal()}
          connection={selected || undefined}
          onSubmit={(name: string) => handleSaveConnection(name)}
        />
      ) : null}

      {confirmation ? (
        <ModalConfirmation
          open={confirmation}
          onClose={() => handleCloseModalConfirmation()}
          onConfirm={() => handleDeleteConnection()}
          title="Deletar conexão"
          message={`Tem certeza que deseja deletar a conexão ${selected?.name}?`}
        />
      ) : null}

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
