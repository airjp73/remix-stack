import type { FirebaseOptions } from "firebase/app";
import { getApp, getApps } from "firebase/app";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  inMemoryPersistence,
  connectAuthEmulator,
} from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";

export type FirebaseClientOptions = FirebaseOptions & {
  emulatorUrl?: string;
};

export const getFirebase = ({
  emulatorUrl,
  ...rest
}: FirebaseClientOptions) => {
  if (getApps().length === 0) {
    const app = initializeApp(rest);

    const auth = getAuth(app);
    auth.languageCode = document.documentElement.lang;
    // Let Remix handle the persistence via session cookies
    setPersistence(auth, inMemoryPersistence);

    const storage = getStorage(app);

    if (emulatorUrl) {
      connectAuthEmulator(auth, `http://${emulatorUrl}`);
      connectStorageEmulator(getStorage(app), "localhost", 9199);
    }

    return { auth, app, storage };
  } else {
    const app = getApp();
    const auth = getAuth(app);
    const storage = getStorage(app);
    return { auth, app, storage };
  }
};
