import type { FirebaseOptions } from "firebase/app";
import { getApp, getApps } from "firebase/app";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  inMemoryPersistence,
  connectAuthEmulator,
} from "firebase/auth";

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

    if (emulatorUrl) {
      connectAuthEmulator(auth, `http://${emulatorUrl}`);
    }

    return { auth, app };
  } else {
    const app = getApp();
    const auth = getAuth(app);
    return { auth, app };
  }
};
