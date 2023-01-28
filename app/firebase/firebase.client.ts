import type { FirebaseOptions } from "firebase/app";
import { getApp, getApps } from "firebase/app";
import { initializeApp } from "firebase/app";
import { inMemoryPersistence } from "firebase/auth";
import { getAuth, setPersistence } from "firebase/auth";

export const getClientAuth = (options: FirebaseOptions) => {
  console.log(options);
  if (getApps().length === 0) {
    const app = initializeApp(options);
    const auth = getAuth(app);

    // Let Remix handle the persistence via session cookies
    setPersistence(auth, inMemoryPersistence);
    return auth;
  } else {
    const app = getApp();
    return getAuth(app);
  }
};
