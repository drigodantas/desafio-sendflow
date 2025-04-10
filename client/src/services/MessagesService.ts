import dayjs from 'dayjs';
import {
  addDoc,
  collection,
  orderBy,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { collectionData } from 'rxfire/firestore';
import { Observable, throwError } from 'rxjs';

export interface MessageDTO {
  id: string;
  text: string;
  user_id: string;
  contacts_id: string[];
  send_date: Timestamp;
  status: 'scheduled' | 'sent';
}

export function ListenerMessages$(filter: string): Observable<MessageDTO[]> {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    console.error('Usuário não autenticado');
    return throwError(() => new Error('Usuário não autenticado'));
  }

  const filters = [where('user_id', '==', userId)];

  if (filter !== 'all') {
    filters.push(where('status', '==', filter));
  }

  const messagesQuery = query(
    collection(db, 'messages'),
    orderBy('send_date', 'asc'),
    ...filters,
  );

  return collectionData(messagesQuery, { idField: 'id' }) as Observable<
    MessageDTO[]
  >;
}

export async function scheduleMessage(props: {
  text: string;
  sendDate: string;
  selectedContacts: string[];
  selectedConnection: string[];
}): Promise<void> {
  const { text, sendDate, selectedContacts, selectedConnection } = props;
  const userId = auth.currentUser?.uid;

  if (!userId) {
    console.error('Usuário não autenticado');
    return;
  }

  await addDoc(collection(db, 'messages'), {
    text,
    send_date: Timestamp.fromDate(dayjs(sendDate).toDate()),
    contacts_id: selectedContacts,
    status: 'scheduled',
    user_id: userId,
    connection: selectedConnection,
    created_at: Timestamp.fromDate(new Date()),
    updated_at: Timestamp.fromDate(new Date()),
  });
}
