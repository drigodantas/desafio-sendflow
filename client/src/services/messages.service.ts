import dayjs from 'dayjs';
import {
  addDoc,
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  Timestamp,
  where,
} from 'firebase/firestore';
import { auth, db } from '../firebase';

export async function listenerMessages(
  callback: (snapshot: QuerySnapshot<DocumentData>) => void,
  filter: string,
) {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    console.error('Usuário não autenticado');
    return;
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

  const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
    callback(snapshot);
  });

  return unsubscribe;
}

export async function scheduleMessage({
  text,
  sendDate,
  selectedContacts,
  selectedConnection,
}: {
  text: string;
  sendDate: string;
  selectedContacts: string[];
  selectedConnection: string[];
}) {
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
