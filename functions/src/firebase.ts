import admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebaseCredential from "./configs/firebaseCredentials";
import firebaseAccount from "./configs/firebaseAccounts";

const firebaseConfig = {
  apiKey: firebaseAccount.FIREBASE_API_KEY,
  authDomain: firebaseAccount.FIREBASE_AUTH_DOMAIN,
  projectId: firebaseAccount.FIREBASE_PROJECT_ID,
  storageBucket: firebaseAccount.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: firebaseAccount.FIREBASE_MESSAGING_SENDER_ID,
  appId: firebaseAccount.FIREBASE_APP_ID,
};

const serviceAccount = {
  type: firebaseCredential.type,
  project_id: firebaseCredential.project_id,
  private_key_id: firebaseCredential.private_key_id,
  private_key: firebaseCredential.private_key,
  client_email: firebaseCredential.client_email,
  client_id: firebaseCredential.client_id,
  auth_uri: firebaseCredential.auth_uri,
  token_uri: firebaseCredential.token_uri,
  auth_provider_x509_cert_url: firebaseCredential.auth_provider_x509_cert_url,
  client_x509_cert_url: firebaseCredential.client_x509_cert_url,
  universe_domain: firebaseCredential.universe_domain,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
