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
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from '../firebase';

export async function listenerContacts(
  callback: (snapshot: QuerySnapshot<DocumentData>) => void,
): Promise<Unsubscribe | void> {
  const user = auth.currentUser;
  if (!user) return;

  const contactsQuery = query(
    collection(db, 'contacts'),
    where('user_id', '==', user.uid),
  );

  const unsubscribe = onSnapshot(contactsQuery, (snapshot) => {
    callback(snapshot);
  });

  return () => unsubscribe();
}

export async function createContact({
  name,
  number,
}: {
  name: string;
  number: string;
}): Promise<void> {
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

export async function updateContact({
  name,
  number,
  contactId,
}: {
  name: string;
  number: string;
  contactId: string;
}): Promise<void> {
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
