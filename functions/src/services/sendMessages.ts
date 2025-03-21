import {
  collection,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export default async function sendMessage() {
  const messagesCollection = collection(db, "messages");

  const now = Timestamp.now();

  const sendMessageQuery = query(
    messagesCollection,
    where("status", "==", "scheduled"),
    where("send_date", "<=", now)
  );

  const sendMessages = await getDocs(sendMessageQuery);

  for (const doc of sendMessages.docs) {
    await updateDoc(doc.ref, {
      status: "sent",
      updated_at: Timestamp.now(),
    });
  }
}
