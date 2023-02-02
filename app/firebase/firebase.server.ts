import type { App } from "firebase-admin/app";
import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import { env } from "~/env/env.server";

let app: App;

if (getApps().length === 0) {
  const j = JSON.parse(env.FIREBASE_SERVICE_KEY);
  app = initializeApp({
    credential: cert(j),
  });
} else {
  app = getApp();
}

export const serverAuth = getAuth(app);
export const serverStorage = getStorage(app);
