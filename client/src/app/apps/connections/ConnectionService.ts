import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { Observable, throwError } from 'rxjs';
import { auth, db } from '../../../firebase';

export interface ConnectionDTO {
  id: string;
  name: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export function ListenerConnections$(): Observable<ConnectionDTO[]> {
  const user = auth.currentUser;

  if (!user) {
    console.error('Usuário não autenticado');
    return throwError(() => new Error('Usuário não autenticado'));
  }

  const connectionsQuery = query(
    collection(db, 'connections'),
    where('user_id', '==', user.uid),
  );

  return collectionData(connectionsQuery, { idField: 'id' }) as Observable<
    ConnectionDTO[]
  >;
}

export async function createConnection(name: string): Promise<void> {
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

export async function updateConnection(props: {
  name: string;
  connectionId: string;
}): Promise<void> {
  const { name, connectionId } = props;

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

export async function deleteConnection(connectionId: string): Promise<void> {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    console.error('Usuário não autenticado');
    return;
  }

  const connectionRef = doc(db, 'connections', connectionId);
  await deleteDoc(connectionRef);
}
