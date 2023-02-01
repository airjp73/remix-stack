import { json, LoaderArgs } from "@remix-run/server-runtime";
import { useMachine } from "@xstate/react";
import { ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { FileError, FileRejection } from "react-dropzone";
import { useTranslation } from "react-i18next";
import invariant from "tiny-invariant";
import { assign, createMachine } from "xstate";
import { useFirebase } from "~/firebase/firebase";
import { requireAuthentication } from "~/session.server";
import { ThemeToggle } from "~/theme";
import { Alert } from "~/ui/Alert";
import { FileUploadArea } from "~/ui/FileUploadArea";
import { Link } from "~/ui/Link";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderArgs) => {
  await requireAuthentication(request);
  return json({});
};

const uploadMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDMCWAbMBVADug9gIYQB0qEmAxGpgIIDG9YOALpANoAMAuoqDvlioWqfADs+IAB6IAjACYArCUUAaEAE85AZgBsJefN2KA7LvkAWC5wAcNpQF8H6mtjxFSAV3fFUYqJQQ4mBkYgBu+ADWIa64BMQk3vEQflAIfhH0hCLiXNx5kgJCORJI0oiKFgCcJFVVhpyyJjYmVTbm6loINrIqnP2ybS2c8pxtTi4YbsmJPin+lGAATkv4SyR42chrALYksXOzyanp4fhZJXkFZUXCoqWgMgiVNXUNTS1tHZpy8jX9AyGJhGYxsExABxm5CorgASmAAFZgehsCDXfiCO7iSRPBTKNQ-BBGGomIyKKrA3SyRRjCxOZwgMT4CBwSSQjyFTElHGIAC0uk6fP0AJFov6JnB7IS0LAnOK9x5CAs8kFRPaJGaugsxiq2isdiqkqmcQ8Rw8qTlWIe5QQ2kUyiUzSMzVa7RVhNksm0BjJZks1jsjgZUtIy1WS0t3LKTzMnAMNP6Fma2iUVNVSgsJCpbXkNm0nD0efsRswJoSsE8jDg8BuXIV0cQsfjAKTedTslVNjjCcaQJB43pQA */
  createMachine({
    id: "fileUpload",
    tsTypes: {} as import("./upload-profile-picture.typegen").Typegen0,
    schema: {
      context: {} as { error?: string },
      events: {} as
        | { type: "fileRejected"; rejection: FileRejection }
        | { type: "fileAccepted"; file: File },
      services: {} as {
        uploadFile: { data: void };
      },
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
        invoke: {
          src: "uploadFile",
          onDone: "success",
          onError: {
            target: "error",
            actions: "setErrorFromUnknown",
          },
        },
      },
      error: {
        exit: "clearError",
      },
      success: {},
    },

    initial: "idle",
  });

export default function Upload() {
  const { t } = useTranslation();
  const user = useUser();
  const { storage } = useFirebase();
  const [state, send] = useMachine(uploadMachine, {
    actions: {
      clearError: assign({ error: undefined }),
      setErrorFromUnknown: assign({
        error: (_context, event) => {
          if (event.data instanceof Error) return event.data.message;
          return undefined;
        },
      }),
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
    },
    services: {
      uploadFile: async (context, event) => {
        const fileRef = ref(
          storage(),
          `profile-pictures/${user.firebase_uid}/profile`
        );
        await uploadBytes(fileRef, event.file);
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
            {state.matches("error") && (
              <Alert
                variant="error"
                title={state.context.error ?? t("uploadProfilePicture.error")}
              />
            )}
            {state.matches("success") && (
              <Alert
                variant="success"
                title={t("uploadProfilePicture.success")}
                details={
                  <Link href="/dashboard">
                    {t("uploadProfilePicture.backToDashboard")}
                  </Link>
                }
              />
            )}
            {!state.matches("success") && (
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
            )}
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
