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
import type { ConnectionDTO } from '../../../dtos/connection.dto';
import { auth, db } from '../../../firebase';

interface Datas {
  connections: ConnectionDTO[];
  loading: boolean;
}

interface DatasModal {
  open: boolean;
  confirmation: boolean;
  selected: ConnectionDTO | null;
  alert: AlertDTO | null;
}

export function useConnections() {
  const [datas, setDatas] = useState<Datas>({
    connections: [],
    loading: true,
  });

  const [datasModal, setDatasModal] = useState<DatasModal>({
    open: false,
    confirmation: false,
    selected: null,
    alert: null,
  });

  const getConnections = useCallback(async () => {
    setDatas((prev) => ({ ...prev, loading: true }));

    try {
      const user = auth.currentUser;

      if (!user) return;

      const connections = query(
        collection(db, 'connections'),
        where('user_id', '==', user.uid),
      );

      const snapshot = await getDocs(connections);

      const updatedConnections = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));

      setDatas((prev) => ({
        ...prev,
        connections: updatedConnections,
        loading: false,
      }));
    } catch (error) {
      console.error('Erro ao buscar conexões:', error);
      setDatas((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const handleOpenModal = useCallback((connection: ConnectionDTO | null) => {
    setDatasModal((prev) => ({ ...prev, open: true, selected: connection }));
  }, []);

  const handleCloseModal = useCallback(() => {
    setDatasModal((prev) => ({ ...prev, open: false, selected: null }));
  }, []);

  const handleOpenModalConfirmation = useCallback(
    (connection: ConnectionDTO) => {
      setDatasModal((prev) => ({
        ...prev,
        confirmation: true,
        selected: connection,
      }));
    },
    [],
  );

  const handleCloseModalConfirmation = useCallback(() => {
    setDatasModal((prev) => ({ ...prev, confirmation: false, selected: null }));
    getConnections();
  }, [getConnections]);

  const handleOpenAlert = useCallback((alert: AlertDTO) => {
    setDatasModal((prev) => ({ ...prev, alert }));
  }, []);

  const handleCloseAlert = useCallback(() => {
    setDatasModal((prev) => ({ ...prev, alert: null }));
  }, []);

  const handleDeleteConnection = useCallback(async () => {
    if (!datasModal.selected) {
      console.error('ID da conexão não encontrado!');
      return;
    }

    const id = datasModal.selected.id;

    if (!id) {
      handleOpenAlert({
        message: 'ID da conexão não encontrado!',
        severity: 'error',
      });
      return;
    }

    try {
      await deleteDoc(doc(db, 'connections', id));
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

  const handleCreateConnection = useCallback(
    async (name: string) => {
      const userId = auth.currentUser?.uid;

      if (!userId) {
        console.error('Usuário não autenticado');
        return;
      }

      try {
        if (datasModal.selected) {
          const connectionRef = doc(db, 'connections', datasModal.selected.id);

          await updateDoc(connectionRef, { name, user_id: userId });
        } else {
          await addDoc(collection(db, 'connections'), {
            name,
            user_id: userId,
          });
        }

        getConnections();
        handleCloseModal();
        handleOpenAlert({
          message: 'Conexão salva com sucesso!',
          severity: 'success',
        });
      } catch (error) {
        handleOpenAlert({
          message: 'Erro ao salvar conexão!',
          severity: 'error',
        });
      }
    },
    [datasModal.selected, getConnections, handleCloseModal, handleOpenAlert],
  );

  useEffect(() => {
    getConnections();
  }, [getConnections]);

  return {
    connections: datas.connections,
    loading: datas.loading,
    open: datasModal.open,
    confirmation: datasModal.confirmation,
    selected: datasModal.selected,
    alert: datasModal.alert,
    getConnections,
    handleOpenModal,
    handleCloseModal,
    handleOpenModalConfirmation,
    handleCloseModalConfirmation,
    handleOpenAlert,
    handleCloseAlert,
    handleDeleteConnection,
    handleCreateConnection,
  };
}
