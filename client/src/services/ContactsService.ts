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
import { auth, db } from '../firebase';

export interface ContactDTO {
  id: string;
  name: string;
  number: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export function ListenerContacts$(): Observable<ContactDTO[]> {
  const user = auth.currentUser;

  if (!user) {
    console.error('Usuário não autenticado');
    return throwError(() => new Error('Usuário não autenticado'));
  }

  const contactsQuery = query(
    collection(db, 'contacts'),
    where('user_id', '==', user.uid),
  );

  return collectionData(contactsQuery, { idField: 'id' }) as Observable<
    ContactDTO[]
  >;
}

export async function createContact(props: {
  name: string;
  number: string;
}): Promise<void> {
  const { name, number } = props;

  const userId = auth.currentUser?.uid;

  if (!userId) {
    console.error('Usuário não autenticado');
    return;
  }
  await addDoc(collection(db, 'contacts'), {
    name,
    number,
    user_id: userId,
    created_at: Timestamp.fromDate(new Date()),
    updated_at: Timestamp.fromDate(new Date()),
  });
}

export async function updateContact(props: {
  name: string;
  number: string;
  contactId: string;
}): Promise<void> {
  const { name, number, contactId } = props;
  const userId = auth.currentUser?.uid;

  if (!userId) {
    console.error('Usuário não autenticado');
    return;
  }

  const contactRef = doc(db, 'contacts', contactId);
  await updateDoc(contactRef, {
    name,
    number,
    user_id: userId,
    updated_at: Timestamp.fromDate(new Date()),
  });
}

export async function deleteContact(contactId: string): Promise<void> {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    console.error('Usuário não autenticado');
    return;
  }

  const contactRef = doc(db, 'contacts', contactId);
  await deleteDoc(contactRef);
}
