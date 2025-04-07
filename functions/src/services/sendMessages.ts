import { Timestamp } from "firebase-admin/firestore";
import { db } from "../firebase";

export default async function sendMessage() {
  const now = Timestamp.now();

  const sendMessageQuery = db
    .collection("messages")
    .where("status", "==", "scheduled")
    .where("send_date", "<=", now);

  const snapshot = await sendMessageQuery.get();

  for (const doc of snapshot.docs) {
    await doc.ref.update({
      status: "sent",
      updated_at: Timestamp.now(),
    });
  }
}
