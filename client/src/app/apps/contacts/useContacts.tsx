import { useCallback, useEffect, useState } from 'react';
import {
  ContactDTO,
  createContact,
  deleteContact,
  ListenerContacts$,
  updateContact,
} from '../../../app/apps/contacts/ContactsService';
import type { AlertDTO } from '../../../app/dtos/AlertDTO';
import { ModalConfirmation } from '../components/ModalConfirmation';
import { closeDialog, openDialog } from '../dialog/DialogFacade';
import ModalContacts from './ModalContacts';

interface Datas {
  contacts: ContactDTO[];
  loading: boolean;
}

interface DatasModal {
  open: boolean;
  confirmation: boolean;
  selected: ContactDTO | null;
  loading: boolean;
  alert: AlertDTO | null;
}

export function useContacts() {
  const [datas, setDatas] = useState<Datas>({
    contacts: [],
    loading: true,
  });

  const [datasModal, setDatasModal] = useState<DatasModal>({
    open: false,
    confirmation: false,
    selected: null,
    alert: null,
    loading: false,
  });

  useEffect(() => {
    const subscription = ListenerContacts$().subscribe((docs) => {
      setDatas({
        contacts: docs,
        loading: false,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleOpenModal = useCallback((contact: ContactDTO | null) => {
    openDialog({
      fullWidth: true,
      maxWidth: 'sm',
      key: 'modal-contacts',
      open: true,
      children: (
        <ModalContacts
          contact={contact}
          onSubmit={async (name: string, number: string) => {
            await handleSaveContact(name, number, contact);

            closeDialog({ key: 'modal-contacts', open: false });
          }}
        />
      ),
    });
  }, []);

  const handleOpenModalConfirmation = useCallback((contact: ContactDTO) => {
    openDialog({
      key: 'modal-confirmation',
      open: true,
      children: (
        <ModalConfirmation
          title="Deletar contato"
          message={`Você tem certeza que deseja deletar o contato ${contact.name}?`}
          onConfirm={async () => {
            await handleDeleteContact(contact);
            closeDialog({ key: 'modal-confirmation', open: false });
          }}
          onClose={() =>
            closeDialog({ key: 'modal-confirmation', open: false })
          }
        />
      ),
    });
  }, []);

  const handleOpenAlert = useCallback((alert: AlertDTO) => {
    setDatasModal((prev) => ({ ...prev, alert }));
  }, []);

  const handleCloseAlert = useCallback(() => {
    setDatasModal((prev) => ({ ...prev, alert: null }));
  }, []);

  const handleDeleteContact = useCallback(
    async (contact: ContactDTO) => {
      if (!contact) {
        console.error('Contato não encontrado!');
        return;
      }

      const contactId = contact.id;

      if (!contactId) {
        console.error('ID do contato não encontrado!');
        return;
      }

      try {
        await deleteContact(contactId);
        handleOpenAlert({
          message: 'Contato deletado com sucesso!',
          severity: 'success',
        });
      } catch (error) {
        handleOpenAlert({
          message: 'Erro ao deletar contato!',
          severity: 'error',
        });
      }
    },
    [datasModal.selected, handleOpenAlert],
  );

  const handleSaveContact = useCallback(
    async (name: string, number: string, contact: ContactDTO | null) => {
      console.log({ datasModal });
      try {
        if (contact) {
          const contactId = contact.id;
          await updateContact({
            name,
            number,
            contactId,
          });
        } else {
          await createContact({ name, number });
        }
        handleOpenAlert({
          message: 'Contato salvo com sucesso!',
          severity: 'success',
        });
      } catch (error) {
        console.error(error);
        handleOpenAlert({
          message: 'Erro ao salvar contato!',
          severity: 'error',
        });
        setDatasModal((prev) => ({ ...prev, loading: false }));
      }
    },
    [datasModal.selected, handleOpenAlert],
  );

  return {
    contacts: datas.contacts,
    loading: datas.loading,
    open: datasModal.open,
    confirmation: datasModal.confirmation,
    selected: datasModal.selected,
    alert: datasModal.alert,
    handleOpenModal,
    handleOpenModalConfirmation,
    handleOpenAlert,
    handleCloseAlert,
    handleDeleteContact,
    handleSaveContact,
  };
}
