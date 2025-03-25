import { useCallback, useEffect, useState } from 'react';
import type { AlertDTO } from '../../../dtos/alert.dto';
import type { ContactDTO } from '../../../dtos/contact.dto';
import {
  createContact,
  deleteContact,
  listenerContacts,
  updateContact,
} from '../../../services/contacts.service';

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
    listenerContacts((snapshot) => {
      setDatas({
        contacts: snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          number: doc.data().number,
          created_at: doc.data().created_at,
          updated_at: doc.data().updated_at,
        })),
        loading: false,
      });
    });
  }, []);

  const handleOpenModal = useCallback((connection: ContactDTO | null) => {
    setDatasModal((prev) => ({ ...prev, open: true, selected: connection }));
  }, []);

  const handleCloseModal = useCallback(() => {
    setDatasModal((prev) => ({ ...prev, open: false, selected: null }));
  }, []);

  const handleOpenModalConfirmation = useCallback((connection: ContactDTO) => {
    setDatasModal((prev) => ({
      ...prev,
      confirmation: true,
      selected: connection,
    }));
  }, []);

  const handleCloseModalConfirmation = useCallback(() => {
    setDatasModal((prev) => ({ ...prev, confirmation: false, selected: null }));
  }, []);

  const handleOpenAlert = useCallback((alert: AlertDTO) => {
    setDatasModal((prev) => ({ ...prev, alert }));
  }, []);

  const handleCloseAlert = useCallback(() => {
    setDatasModal((prev) => ({ ...prev, alert: null }));
  }, []);

  const handleDeleteContact = useCallback(async () => {
    if (!datasModal.selected) {
      console.error('Contato não encontrado!');
      return;
    }

    const id = datasModal.selected.id;

    if (!id) {
      console.error('ID do contato não encontrado!');
      return;
    }

    try {
      await deleteContact({ contactId: id });
      handleCloseModalConfirmation();
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
  }, [datasModal.selected, handleCloseModalConfirmation, handleOpenAlert]);

  const handleSaveContact = useCallback(
    async (name: string, number: string) => {
      setDatasModal((prev) => ({ ...prev, loading: true }));

      try {
        if (datasModal.selected) {
          const contactId = datasModal.selected.id;
          await updateContact({
            name,
            number,
            contactId,
          });
        } else {
          await createContact({ name, number });
        }

        handleCloseModal();
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
    [datasModal.selected, handleCloseModal, handleOpenAlert],
  );

  return {
    contacts: datas.contacts,
    loading: datas.loading,
    open: datasModal.open,
    confirmation: datasModal.confirmation,
    selected: datasModal.selected,
    alert: datasModal.alert,
    handleOpenModal,
    handleCloseModal,
    handleOpenModalConfirmation,
    handleCloseModalConfirmation,
    handleOpenAlert,
    handleCloseAlert,
    handleDeleteContact,
    handleSaveContact,
  };
}
