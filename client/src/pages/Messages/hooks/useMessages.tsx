import { useCallback, useEffect, useState } from 'react';

import {
  ListenerMessages$,
  MessageDTO,
} from '../../../services/MessagesService';

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
    const subscription = ListenerMessages$(datas.filter).subscribe((docs) => {
      setDatas((prev) => ({
        messages: docs,
        loading: false,
        filter: prev.filter,
      }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
