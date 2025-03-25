import { useCallback, useEffect, useState } from 'react';
import type { AlertDTO } from '../../../dtos/alert.dto';
import type { ConnectionDTO } from '../../../dtos/connection.dto';
import {
  createConnection,
  deleteConnection,
  listenerConnections,
  updateConnection,
} from '../../../services/connection.service';

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

  useEffect(() => {
    listenerConnections((snapshot) => {
      setDatas({
        connections: snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          created_at: doc.data().created_at,
          updated_at: doc.data().updated_at,
        })),
        loading: false,
      });
    });
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
  }, []);

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

    const connectionId = datasModal.selected.id;

    if (!connectionId) {
      handleOpenAlert({
        message: 'ID da conexão não encontrado!',
        severity: 'error',
      });
      return;
    }

    try {
      await deleteConnection(connectionId);
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

  const handleSaveConnection = useCallback(
    async (name: string) => {
      try {
        if (datasModal.selected) {
          const connectionId = datasModal.selected.id;

          await updateConnection({
            name,
            connectionId,
          });
        } else {
          await createConnection(name);
        }

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
    [datasModal.selected, handleCloseModal, handleOpenAlert],
  );

  return {
    connections: datas.connections,
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
    handleDeleteConnection,
    handleSaveConnection,
  };
}
