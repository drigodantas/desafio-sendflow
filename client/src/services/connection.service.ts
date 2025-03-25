import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  query,
  QuerySnapshot,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from '../firebase';

export async function listenerConnections(
  callback: (snapshot: QuerySnapshot<DocumentData>) => void,
) {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    console.error('Usuário não autenticado');
    return;
  }

  const connectionsQuery = query(
    collection(db, 'connections'),
    where('user_id', '==', userId),
  );

  const unsubscribe = onSnapshot(connectionsQuery, (snapshot) => {
    callback(snapshot);
  });

  return () => unsubscribe();
}

export async function createConnection({ name }: { name: string }) {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    console.error('Usuário não autenticado');
    return;
  }
  await addDoc(collection(db, 'connections'), {
    name,
    user_id: userId,
    created_at: Timestamp.fromDate(new Date()),
    updated_at: Timestamp.fromDate(new Date()),
  });
}

export async function updateConnection({
  name,
  connectionId,
}: {
  name: string;
  connectionId: string;
}) {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    console.error('Usuário não autenticado');
    return;
  }

  const connectionRef = doc(db, 'connections', connectionId);
  await updateDoc(connectionRef, {
    name,
    user_id: userId,
    updated_at: Timestamp.fromDate(new Date()),
  });
}

export async function deleteConnection({
  connectionId,
}: {
  connectionId: string;
}) {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    console.error('Usuário não autenticado');
    return;
  }

  const connectionRef = doc(db, 'connections', connectionId);
  await deleteDoc(connectionRef);
}
