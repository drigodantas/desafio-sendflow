import { useCallback, useEffect, useState } from 'react';
import {
  ConnectionDTO,
  createConnection,
  deleteConnection,
  ListenerConnections$,
  updateConnection,
} from '../../../app/apps/connections/ConnectionService';
import { AlertDTO } from '../../dtos/AlertDTO';
import { ModalConfirmation } from '../components/ModalConfirmation';
import { closeDialog, openDialog } from '../dialog/DialogFacade';
import { ModalConnections } from './ModalConnections';

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
    const subscription = ListenerConnections$().subscribe((docs) => {
      setDatas({
        connections: docs,
        loading: false,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleOpenModal = useCallback((connection: ConnectionDTO | null) => {
    openDialog({
      fullWidth: true,
      maxWidth: 'sm',
      key: 'modal-connections',
      open: true,
      children: (
        <ModalConnections
          connection={connection}
          onSubmit={async (name: string) => {
            await handleSaveConnection(name, connection);

            closeDialog({ key: 'modal-connections', open: false });
          }}
        />
      ),
    });
  }, []);

  const handleOpenModalConfirmation = useCallback(
    (connection: ConnectionDTO) => {
      openDialog({
        key: 'modal-confirmation-connection',
        open: true,
        children: (
          <ModalConfirmation
            title="Deletar contato"
            message={`Você tem certeza que deseja deletar a conexão ${connection.name}?`}
            onConfirm={async () => {
              await handleDeleteConnection(connection);
              closeDialog({
                key: 'modal-confirmation-connection',
                open: false,
              });
            }}
            onClose={() =>
              closeDialog({ key: 'modal-confirmation-connection', open: false })
            }
          />
        ),
      });
    },
    [],
  );

  const handleOpenAlert = useCallback((alert: AlertDTO) => {
    setDatasModal((prev) => ({ ...prev, alert }));
  }, []);

  const handleCloseAlert = useCallback(() => {
    setDatasModal((prev) => ({ ...prev, alert: null }));
  }, []);

  const handleDeleteConnection = useCallback(
    async (connection: ConnectionDTO) => {
      if (!connection) {
        console.error('Conexão não fornecida!');
        return;
      }

      const connectionId = connection.id;

      if (!connectionId) {
        handleOpenAlert({
          message: 'ID da conexão não encontrado!',
          severity: 'error',
        });
        return;
      }

      try {
        await deleteConnection(connectionId);
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
    },
    [datasModal.selected, handleOpenAlert],
  );

  const handleSaveConnection = useCallback(
    async (name: string, connection: ConnectionDTO | null) => {
      try {
        if (connection) {
          const connectionId = connection.id;

          await updateConnection({
            name,
            connectionId,
          });
        } else {
          await createConnection(name);
        }

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
    [datasModal.selected, handleOpenAlert],
  );

  return {
    connections: datas.connections,
    loading: datas.loading,
    open: datasModal.open,
    confirmation: datasModal.confirmation,
    selected: datasModal.selected,
    alert: datasModal.alert,
    handleOpenModal,
    handleOpenModalConfirmation,
    handleOpenAlert,
    handleCloseAlert,
    handleDeleteConnection,
    handleSaveConnection,
  };
}
