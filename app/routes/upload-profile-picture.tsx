import { useFetcher } from "@remix-run/react";
import {
  ActionArgs,
  json,
  LoaderArgs,
  unstable_parseMultipartFormData,
} from "@remix-run/server-runtime";
import { useMachine } from "@xstate/react";
import { FileRejection } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { assign, createMachine } from "xstate";
import { createFirebaseUploadHandler } from "~/firebase/firebase.server";
import i18next from "~/i18n.server";
import { redirectWithNotification } from "~/notifications";
import { requireAuthentication } from "~/session.server";
import { ThemeToggle } from "~/theme";
import { Alert } from "~/ui/Alert";
import { FileUploadArea } from "~/ui/FileUploadArea";

export const action = async ({ request }: ActionArgs) => {
  const user = await requireAuthentication(request);
  try {
    // Can get formData from the request
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const formData = await unstable_parseMultipartFormData(
      request,
      createFirebaseUploadHandler({
        filePath: `profile-pictures/${user.firebase_uid}/profile`,
        // The return value doesn't really matter in this case
        getReturnVal: (file) => file.name,
      })
    );

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
  /** @xstate-layout N4IgpgJg5mDOIC5QDMCWAbMBVADug9gIYQB0qEmAxGpgEpgBWYAxgC6QDaADALqKg58sVK1T4AdvxAAPRAEYATAFYSATnUa5AZi1KFCgGwAOADQgAnon0qFAFnX2A7I6WOFWgL4ezNbHiKk5FS+AILMzGA47BDcfEgggsKiElKyCIoqGpo6eoamFvJctiT26o62unLlBlye3iC+uATEJACu-sSo4lCUYABOffh99BGoAG6cvFKJImKS8WlKNSRaLlz6ckZGCo7qZpYIRnIkzlq2clwGukpaBo5GXvXi+BBwUo0dENNCsykLiABaAz7QEGEhKLiQrRcJRVVxHZReHwYPzNQIUMDfJJzVKIWwKEEIOwKEgw1RGRxkorbCpIhoopoBNqfLpQLG-eagNLXE6OM62ClyJTC-SEoxcNQaAyqAXEzYPeofNEkfqDPrs5KcmSIU6k1SrNzynZ7ApEriqEhGfVyVTlLTaIy6OpeIA */
  createMachine({
    id: "fileUpload",
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
      },
    },

    initial: "idle",
  });

export default function Upload() {
  const { t } = useTranslation();
  const fetcher = useFetcher<typeof action>();
  const [state, send] = useMachine(uploadMachine, {
    actions: {
      clearError: assign({ error: undefined }),
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
                    maxMegabytes: 10,
                  });
                default:
                  return undefined;
              }
            })
            .filter(Boolean)
            .join(" ");
        },
      }),
      setErrorFromResponse: assign({
        error: (context, error) => error.error,
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
            {(state.matches("error") || fetcher.data?.error) && (
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
                maxSize: 1024 * 1024 * 10, // 10 MB
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
