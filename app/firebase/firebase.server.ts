import type { App } from "firebase-admin/app";
import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import type { Auth } from "firebase-admin/auth";
import { getAuth } from "firebase-admin/auth";
import { env } from "~/env/env.server";

let app: App;
let auth: Auth;

if (getApps().length === 0) {
  const j = JSON.parse(env.FIREBASE_SERVICE_KEY);
  app = initializeApp({
    credential: cert(j),
  });
  auth = getAuth(app);
} else {
  app = getApp();
  auth = getAuth(app);
}

export const serverAuth = auth;
