import { useFetcher } from "@remix-run/react";
import { ActionArgs, json, LoaderArgs } from "@remix-run/server-runtime";
import { useMachine } from "@xstate/react";
import { FileRejection } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { assign, createMachine } from "xstate";
import { FirebaseImageUpload as FirebaseImageUploader } from "~/firebase/firebase.server";
import i18next from "~/i18n.server";
import { update_user } from "~/models/user.server";
import { redirectWithNotification } from "~/notifications";
import { requireAuthentication } from "~/session.server";
import { ThemeToggle } from "~/theme";
import { Alert } from "~/ui/Alert";
import { FileUploadArea } from "~/ui/FileUploadArea";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { useEffect } from "react";
import { MAX_IMAGE_BYTES, MAX_IMAGE_MB } from "~/firebase/firebase";

const uploadSchema = zfd.formData({
  picture: z.string().regex(/.+\.(jpg|jpeg|png|gif|webp)$/i),
});

export const action = async ({ request }: ActionArgs) => {
  const user = await requireAuthentication(request);
  try {
    const uploader = new FirebaseImageUploader(`${user.firebase_uid}/images/`);
    const { picture } = uploadSchema.parse(
      await uploader.parseFormData(request)
    );
    await uploader.upload();

    await update_user(user.id, { profile_photo: picture });

    const t = await i18next.getFixedT(request);
    return redirectWithNotification({
      request,
      redirectTo: "/dashboard",
      notification: t("uploadProfilePicture.success"),
      notificationType: "success",
    });
  } catch (err) {
    return json({ error: true }, { status: 500 });
  }
};

export const loader = async ({ request }: LoaderArgs) => {
  await requireAuthentication(request);
  return json({});
};

const uploadMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDMCWAbMBVADug9gIYQB0qEmAxGpgEpgBWYAxgC6QDaADALqKg58sVK1T4AdvxAAPRAEYATAFYSSruq5KAbAoAsADjkBOOfoA0IAJ6Ijukia1b9AZhMB2OVs36Avj4s02HhEpORUgQCCzMxgOOwQ3HxIIILCohJSsgiKKmoa2nqGJuZWiApG+iRuXM5yugr6RgpOTbp+ARhBBMQkAK7BxKjiUJRgAE5j+GP0MagAbpy8UqkiYpLJWUrOziS6blpKbiZcjm6NFtYIhqoaCvu6jk5Kbf4ggbjdpOOTY9SdUTE4oskgIhKsMhtEFsdnsDkc5CctGcjBd5G43PYtnUjM4tM5lFo5M4-K9xPgIHApO8BhBlmD0utQFkALRaVEIZkqIzcnm83nE17Uz5kChgOlpNaZRD1dmKOz6LgVIxcBG6WoNOTtN6dD4hPo0oZQcXgxkyRBuB4kUxuJQKTSFJQVWWHXZY7ZGPFcfRnJRaoV675TY0MqUIZxKFTKM51BR2xV3Nzs2wkRr4m0e1xnZQknxAA */
  createMachine(
    {
      id: "fileUpload",
      predictableActionArguments: true,
      tsTypes: {} as import("./upload-profile-picture.typegen").Typegen0,
      schema: {
        context: {} as { error?: string },
        events: {} as
          | { type: "fileRejected"; rejection: FileRejection }
          | { type: "fileAccepted"; file: File }
          | { type: "errorReceived"; error: string },
      },
      states: {
        idle: {
          on: {
            fileRejected: {
              target: "error",
              actions: "setErrorFromFileRejection",
            },
            fileAccepted: "uploading",
          },
        },

        uploading: {
          on: {
            errorReceived: {
              target: "error",
              actions: "setErrorFromResponse",
            },
          },

          entry: "beginUpload",
        },

        error: {
          exit: "clearError",

          on: {
            fileAccepted: "uploading",
          },
        },
      },

      initial: "idle",
    },
    {
      actions: {
        clearError: assign({ error: (_ctx, _event) => undefined }),
        setErrorFromResponse: assign({
          error: (context, error) => error.error,
        }),
      },
    }
  );

export default function Upload() {
  const { t } = useTranslation();
  const fetcher = useFetcher<typeof action>();
  const [state, send] = useMachine(uploadMachine, {
    actions: {
      setErrorFromFileRejection: assign({
        error: (_context, event) => {
          const errors = event.rejection.errors;
          if (errors.length === 0) return undefined;
          return errors
            .map((error) => {
              switch (error.code) {
                case "file-too-large":
                  return t("uploadProfilePicture.validation.fileTooLarge", {
                    fileName: event.rejection.file.name,
                    maxMegabytes: MAX_IMAGE_MB,
                  });
                case "file-invalid-type":
                  return t("uploadProfilePicture.validation.invalidFileType", {
                    fileName: event.rejection.file.name,
                    maxMegabytes: 10,
                  });
                default: {
                  reportError(
                    new Error(`Unhandled file upload error: ${error.code}`)
                  );
                  return undefined;
                }
              }
            })
            .filter(Boolean)
            .join(" ");
        },
      }),
      beginUpload: (context, event) => {
        const data = new FormData();
        data.append("picture", event.file, event.file.name);
        fetcher.submit(data, {
          method: "post",
          encType: "multipart/form-data",
        });
      },
    },
  });

  useEffect(() => {
    if (fetcher.data?.error) {
      send("errorReceived");
    }
  }, [fetcher.data?.error, send]);

  return (
    <div className="h-full">
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            {t("uploadProfilePicture.header")}
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="space-y-6 bg-white py-8 px-4 shadow-lg dark:bg-gray-800 sm:rounded-lg sm:px-10">
            {state.matches("error") && (
              <Alert
                variant="error"
                title={state.context.error || t("uploadProfilePicture.error")}
              />
            )}
            <FileUploadArea
              name="picture"
              isLoading={state.matches("uploading")}
              loadingLabel={t("uploadProfilePicture.uploading")}
              dropzoneOptions={{
                maxSize: MAX_IMAGE_BYTES,
                accept: {
                  "image/png": [".png"],
                  "image/jpeg": [".jpeg", ".jpg"],
                  "image/gif": [".gif"],
                  "image/webp": [".webp"],
                },
                onDropAccepted: async (files) => {
                  send({ type: "fileAccepted", file: files[0] });
                },
                onDropRejected: (rejections) => {
                  send({
                    type: "fileRejected",
                    rejection: rejections[0],
                  });
                },
              }}
            />
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
