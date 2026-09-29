import { getApp, getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Public web configuration. Authentication for the store remains in the AWS API.
const firebaseConfig = {
  apiKey: "AIzaSyDM1WadRswoPOi5-CwiboJUcaIfx-F9zjE",
  authDomain: "portafolio-91b9c.firebaseapp.com",
  databaseURL: "https://portafolio-91b9c-default-rtdb.firebaseio.com",
  projectId: "portafolio-91b9c",
  storageBucket: "portafolio-91b9c.appspot.com",
  messagingSenderId: "220550201921",
  appId: "1:220550201921:web:a1b9f3c9c17664a902fcc0",
  measurementId: "G-6CKGWS2W7R",
};
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);

// Call only when analytics is intentionally enabled; no automatic tracking on startup.
export async function enableAnalytics() {
  const { getAnalytics, isSupported } = await import("firebase/analytics");
  return (await isSupported()) ? getAnalytics(firebaseApp) : null;
}
