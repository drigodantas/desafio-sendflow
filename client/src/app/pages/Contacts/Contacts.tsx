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
import { useContacts } from '../../apps/contacts/useContacts';

export default function Contacts() {
  const {
    contacts,
    loading,
    alert,
    handleCloseAlert,
    handleOpenModal,
    handleOpenModalConfirmation,
  } = useContacts();

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-xl">Contatos</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal(null)}
        >
          Adicionar contato
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
                sx={{ color: 'white', fontWeight: 'bold', width: '60%' }}
              >
                Nome
              </TableCell>
              <TableCell
                key={'number'}
                sx={{ color: 'white', fontWeight: 'bold', width: '30%' }}
              >
                Telefone
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
            {contacts?.map((contact) => (
              <TableRow key={contact?.id} className="bg-gray-100">
                <TableCell>{contact?.name}</TableCell>
                <TableCell>{contact?.number}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenModal(contact)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleOpenModalConfirmation(contact)}
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
