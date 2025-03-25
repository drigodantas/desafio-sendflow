import { useCallback, useEffect, useState } from 'react';
import type { MessageDTO } from '../../../dtos/message.dto';
import { listenerMessages } from '../../../services/messages.service';

interface Datas {
  messages: MessageDTO[];
  loading: boolean;
  filter: string;
}

export function useMessages() {
  const [datas, setDatas] = useState<Datas>({
    messages: [],
    loading: true,
    filter: 'all',
  });

  useEffect(() => {
    listenerMessages((snapshot) => {
      setDatas((prev) => ({
        messages: snapshot.docs.map((doc) => ({
          id: doc.id,
          text: doc.data().text,
          created_at: doc.data().created_at,
          updated_at: doc.data().updated_at,
          status: doc.data().status,
          user_id: doc.data().user_id,
          contacts_id: doc.data().contacts_id,
          send_date: doc.data().send_date,
        })),
        filter: prev.filter,
        loading: false,
      }));
    }, datas.filter);
  }, [datas.filter]);

  const changeFilter = useCallback((filter: string) => {
    setDatas((prev) => ({ ...prev, filter }));
  }, []);

  return {
    messages: datas.messages,
    loading: datas.loading,
    filter: datas.filter,
    changeFilter,
  };
}
