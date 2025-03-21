import { collection, getDocs, query, where } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import type { MessageDTO } from '../../../dtos/message.dto';
import { auth, db } from '../../../firebase';

interface Datas {
  messages: MessageDTO[];
  loading: boolean;
  filter: string;
}

export function useMessages() {
  const [datas, setDatas] = useState<Datas>({
    messages: [],
    loading: true,
    filter: '',
  });

  const getMessages = useCallback(async () => {
    setDatas((prev) => ({ ...prev, loading: true }));

    try {
      const user = auth.currentUser;

      if (!user) return;

      const filters = [where('user_id', '==', user.uid)];

      if (datas.filter) {
        filters.push(where('status', '==', datas.filter));
      }

      const messagesQuery = query(collection(db, 'messages'), ...filters);

      const snapshot = await getDocs(messagesQuery);

      const updatedMessages = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as MessageDTO,
      );

      setDatas((prev) => ({
        ...prev,
        messages: updatedMessages,
        loading: false,
      }));
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      setDatas((prev) => ({ ...prev, loading: false }));
    }
  }, [datas.filter]);

  const changeFilter = useCallback((filter: string) => {
    setDatas((prev) => ({ ...prev, filter }));
  }, []);

  useEffect(() => {
    getMessages();
  }, [getMessages]);

  return {
    messages: datas.messages,
    loading: datas.loading,
    filter: datas.filter,
    getMessages,
    changeFilter,
  };
}
