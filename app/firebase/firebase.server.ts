import { writeAsyncIterableToWritable } from "@remix-run/node";
import { UploadHandler } from "@remix-run/server-runtime";
import type { App } from "firebase-admin/app";
import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getStorage, Storage } from "firebase-admin/storage";
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

// I have no idea if/where this type is exported from firebase-admin
type FirebaseFile = ReturnType<ReturnType<Storage["bucket"]>["file"]>;
type FirebaseUploadHandlerArgs = {
  filePath: string;
  getReturnVal?: (
    file: FirebaseFile,
    fileName?: string
  ) => Awaited<ReturnType<UploadHandler>>;
};

export const createFirebaseUploadHandler = ({
  filePath,
  getReturnVal,
}: FirebaseUploadHandlerArgs) => {
  const handler: UploadHandler = async ({ data, filename }) => {
    const file = serverStorage
      .bucket(env.FIREBASE_CLOUD_STORAGE_BUCKET)
      .file(filePath);
    const writeStream = file.createWriteStream();
    await writeAsyncIterableToWritable(data, writeStream);
    await new Promise((resolve) => writeStream.on("finish", resolve));
    return getReturnVal?.(file, filename) ?? null;
  };
  return handler;
};
