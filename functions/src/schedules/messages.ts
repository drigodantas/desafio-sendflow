import * as functions from "firebase-functions/v1";
import sendMessage from "../services/sendMessages";

export const scheduleMessages = functions.pubsub
  .schedule("* * * * *")
  .timeZone("America/Sao_Paulo")
  .onRun(async () => {
    await sendMessage();
  });
