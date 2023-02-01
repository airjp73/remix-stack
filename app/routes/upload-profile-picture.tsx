import { json, LoaderArgs } from "@remix-run/server-runtime";
import { ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ValidatedForm } from "remix-validated-form";
import { zfd } from "zod-form-data";
import { useFirebase } from "~/firebase/firebase";
import { requireAuthentication } from "~/session.server";
import { ThemeToggle } from "~/theme";
import { Alert } from "~/ui/Alert";
import { FileUploadArea } from "~/ui/FileUploadArea";
import { SubmitButton } from "~/ui/form/SubmitButton";
import { useUser } from "~/utils";
import { makeValidator } from "~/validation";

export const loader = async ({ request }: LoaderArgs) => {
  await requireAuthentication(request);
  return json({});
};

const validator = makeValidator({
  picture: zfd.file(),
});

export default function Upload() {
  const { t } = useTranslation();
  const user = useUser();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const { storage } = useFirebase();

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
            {status === "error" && (
              <Alert
                variant="error"
                title={t("uploadProfilePicture.success")}
              />
            )}
            {status === "success" && (
              <Alert
                variant="success"
                title={t("uploadProfilePicture.success")}
              />
            )}
            <ValidatedForm
              onSubmit={async (data, e) => {
                e.preventDefault();
                try {
                  setStatus("loading");
                  const fileRef = ref(
                    storage(),
                    `profile-pictures/${user.firebase_uid}/profile`
                  );
                  const response = await uploadBytes(fileRef, data.picture);
                  setStatus("success");
                } catch (err) {
                  console.log(err);
                  setStatus("error");
                }
                // can do something with response if desired
              }}
              validator={validator}
              className="space-y-6"
            >
              <FileUploadArea name="picture" />
              <SubmitButton className="w-full" label="Submit" />
            </ValidatedForm>
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
