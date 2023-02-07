import {
  MaxPartSizeExceededError,
  unstable_parseMultipartFormData,
} from "@remix-run/server-runtime";
import type { App } from "firebase-admin/app";
import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import invariant from "tiny-invariant";
import { env } from "~/env/env.server";
import * as path from "path";
import { v4 as uuid } from "uuid";
import { MAX_IMAGE_BYTES } from "./firebase";

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

export class FirebaseImageUpload<T> {
  #uploads: (() => Promise<void>)[];
  #basePath: string;
  #maxBytes: number;

  constructor(basePath: string, maxBytes = MAX_IMAGE_BYTES) {
    this.#basePath = basePath;
    this.#uploads = [];
    this.#maxBytes = maxBytes;
  }

  async parseFormData(request: Request) {
    return await unstable_parseMultipartFormData(request, async (part) => {
      const { data, filename, contentType } = part;
      invariant(filename, "Can't upload file without a filename");

      const fileExtension = path.extname(filename);
      const name = uuid();
      const pathWithExtension = this.#basePath + name + fileExtension;

      this.#uploads.push(async () => {
        const file = serverStorage
          .bucket(env.FIREBASE_CLOUD_STORAGE_BUCKET)
          .file(pathWithExtension);

        const writeStream = file.createWriteStream({
          contentType,
        });

        // Implementation take from createUploadFileHandler in remix
        // because writeAsyncIterableToWriteStream doesn't support setting a max file size
        let deleteFile = false;
        let size = 0;
        try {
          for await (let chunk of data) {
            size += chunk.byteLength;
            if (size > this.#maxBytes) {
              deleteFile = true;
              throw new MaxPartSizeExceededError(name, this.#maxBytes);
            }
            writeStream.write(chunk);
          }
        } finally {
          writeStream.end();
          await new Promise((resolve) => writeStream.on("finish", resolve));

          if (deleteFile) {
            await file.delete();
          }
        }
      });

      return pathWithExtension;
    });
  }

  async upload() {
    await Promise.all(this.#uploads.map((upload) => upload()));
  }
}
