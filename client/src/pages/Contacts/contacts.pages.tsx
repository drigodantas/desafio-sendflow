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
import ModalContacts from './components/modal.contacts.components';
import { useContacts } from './hooks/useContacts.hooks';

export default function Contacts() {
  const {
    contacts,
    loading,
    alert,
    confirmation,
    open,
    selected,
    handleCloseAlert,
    handleCloseModal,
    handleCloseModalConfirmation,
    handleCreateContact,
    handleDeleteContact,
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

      {open ? (
        <ModalContacts
          open={open}
          onClose={() => handleCloseModal()}
          contact={selected}
          onSubmit={(name: string, number: string) =>
            handleCreateContact(name, number)
          }
        />
      ) : null}

      {confirmation ? (
        <ModalConfirmation
          open={confirmation}
          onClose={() => handleCloseModalConfirmation()}
          onConfirm={() => handleDeleteContact()}
          title="Deletar conexão"
          message={`Tem certeza que deseja deletar o contato ${selected?.name}?`}
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
