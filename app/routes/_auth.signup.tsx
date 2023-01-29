import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import type { FirebaseOptions } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import type { TFunction } from "i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { useFirebaseAuth } from "~/firebase/firebase";
import { serverAuth } from "~/firebase/firebase.server";
import { createUserSession } from "~/session.server";
import { Alert } from "~/ui/Alert";
import { Field, FieldInput } from "~/ui/form/Field";
import { SubmitButton } from "~/ui/form/SubmitButton";

const actionBody = zfd.formData({
  idToken: z.string(),
});

export const action = async ({ request }: ActionArgs) => {
  const { idToken } = actionBody.parse(await request.formData());

  await serverAuth.verifyIdToken(idToken);
  return createUserSession({ request, idToken, redirectTo: "/dashboard" });
};

const formValidator = withZod(
  z.object({
    email: zfd.text(z.string().email()),
    // TODO: Improve requirements
    password: zfd.text(z.string().min(8)),
  })
);

export const handle = {
  authHeader: (t: TFunction) => t("login.signupHeader"),
};

export default function Signup() {
  const { t } = useTranslation();
  const { firebaseOptions } = useOutletContext<{
    firebaseOptions: FirebaseOptions;
  }>();
  const auth = useFirebaseAuth(firebaseOptions);
  const fetcher = useFetcher();
  const [error, setError] = useState(false);

  const signIn = async (email: string, password: string) => {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth(),
        email,
        password
      );
      const idToken = await credential.user.getIdToken();
      sendEmailVerification(credential.user);
      fetcher.submit({ idToken }, { method: "post" });
    } catch (err) {
      setError(true);
    }
  };

  return (
    <>
      {error && (
        <Alert
          className="mb-6"
          variant="error"
          details={t("login.signupFailed")}
        />
      )}
      <ValidatedForm
        fetcher={fetcher}
        className="space-y-6"
        validator={formValidator}
        onSubmit={async ({ email, password }, event) => {
          event.preventDefault();
          await signIn(email, password);
        }}
      >
        <Field name="email" label={t("login.emailLabel")}>
          <FieldInput />
        </Field>
        <Field name="password" label={t("login.passwordLabel")}>
          <FieldInput type="password" />
        </Field>
        <SubmitButton
          variant="default"
          label={t("login.signupButton.label")}
          loadingLabel={t("login.signupButton.loadingLabel")!}
          className="w-full"
        />
      </ValidatedForm>
    </>
  );
}
