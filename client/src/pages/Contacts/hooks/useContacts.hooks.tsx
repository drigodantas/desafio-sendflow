import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import type { AlertDTO } from '../../../dtos/alert.dto';
import type { ContactDTO } from '../../../dtos/contact.dto';
import { auth, db } from '../../../firebase';

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

  const getContacts = useCallback(async () => {
    setDatas((prev) => ({ ...prev, loading: true }));

    try {
      const user = auth.currentUser;

      if (!user) return;

      const contactsQuery = query(
        collection(db, 'contacts'),
        where('user_id', '==', user.uid),
      );

      const snapshot = await getDocs(contactsQuery);

      const updatedContacts = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        number: doc.data().number,
      }));

      setDatas((prev) => ({
        ...prev,
        contacts: updatedContacts,
        loading: false,
      }));
    } catch (error) {
      setDatas((prev) => ({ ...prev, loading: false }));
    }
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
    getContacts();
  }, [getContacts]);

  const handleOpenAlert = useCallback((alert: AlertDTO) => {
    setDatasModal((prev) => ({ ...prev, alert }));
  }, []);

  const handleCloseAlert = useCallback(() => {
    setDatasModal((prev) => ({ ...prev, alert: null }));
  }, []);

  const handleDeleteContact = useCallback(async () => {
    if (!datasModal.selected) {
      console.error('ID da conexão não encontrado!');
      return;
    }

    const id = datasModal.selected.id;

    if (!id) {
      console.error('ID da conexão não encontrado!');
      return;
    }

    try {
      await deleteDoc(doc(db, 'contacts', id));

      handleCloseModalConfirmation();
      handleOpenAlert({
        message: 'Contato deletado com sucesso!',
        severity: 'success',
      });
    } catch (error) {
      handleOpenAlert({
        message: 'Erro ao deletar conexão!',
        severity: 'error',
      });
    }
  }, [datasModal.selected, handleCloseModalConfirmation, handleOpenAlert]);

  const handleCreateContact = useCallback(
    async (name: string, number: string) => {
      const userId = auth.currentUser?.uid;

      if (!userId) {
        console.error('Usuário não autenticado');
        return;
      }

      setDatasModal((prev) => ({ ...prev, loading: true }));

      try {
        if (datasModal.selected) {
          const contactRef = doc(db, 'contacts', datasModal.selected.id);
          await updateDoc(contactRef, { name, number, user_id: userId });
        } else {
          await addDoc(collection(db, 'contacts'), {
            name,
            number,
            user_id: userId,
          });
        }

        getContacts();
        handleCloseModal();
        handleOpenAlert({
          message: 'Contato salva com sucesso!',
          severity: 'success',
        });
      } catch (error) {
        handleOpenAlert({
          message: 'Erro ao salvar contato!',
          severity: 'error',
        });
        setDatasModal((prev) => ({ ...prev, loading: false }));
      }
    },
    [datasModal.selected, getContacts, handleCloseModal, handleOpenAlert],
  );

  useEffect(() => {
    getContacts();
  }, [getContacts]);

  return {
    contacts: datas.contacts,
    loading: datas.loading,
    open: datasModal.open,
    confirmation: datasModal.confirmation,
    selected: datasModal.selected,
    alert: datasModal.alert,
    getContacts,
    handleOpenModal,
    handleCloseModal,
    handleOpenModalConfirmation,
    handleCloseModalConfirmation,
    handleOpenAlert,
    handleCloseAlert,
    handleDeleteContact,
    handleCreateContact,
  };
}
