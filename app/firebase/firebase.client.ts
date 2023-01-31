import type { FirebaseOptions } from "firebase/app";
import { getApp, getApps } from "firebase/app";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  inMemoryPersistence,
  connectAuthEmulator,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

export type FirebaseClientOptions = FirebaseOptions & {
  emulatorUrl?: string;
};

const getFirebase = ({ emulatorUrl, ...rest }: FirebaseClientOptions) => {
  if (getApps().length === 0) {
    const app = initializeApp(rest);

    const auth = getAuth(app);
    auth.languageCode = document.documentElement.lang;
    if (emulatorUrl) connectAuthEmulator(auth, `http://${emulatorUrl}`);
    // Let Remix handle the persistence via session cookies
    setPersistence(auth, inMemoryPersistence);

    const storage = getStorage(app);

    return { auth, app, storage };
  } else {
    const app = getApp();
    const auth = getAuth(app);
    const storage = getStorage(app);
    return { auth, app, storage };
  }
};

export const getClientAuth = (options: FirebaseClientOptions) => {
  return getFirebase(options).auth;
};

export const getClientStorage = (options: FirebaseClientOptions) => {
  return getFirebase(options).storage;
};
