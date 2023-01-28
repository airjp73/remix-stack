import { useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { useFirebaseAuth } from "~/firebase/firebase";
import { serverAuth } from "~/firebase/firebase.server";
import { env } from "~/server/env.server";
import { createUserSession } from "~/session.server";
import { ThemeToggle } from "~/theme";
import { Alert } from "~/ui/Alert";
import { Field, FieldInput } from "~/ui/form/Field";
import { SubmitButton } from "~/ui/form/SubmitButton";

export const loader = async () => {
  return json({
    firebaseOptions: {
      apiKey: env.FIREBASE_API_KEY,
      authDomain: env.FIREBASE_AUTH_DOMAIN,
      projectId: env.FIREBASE_PROJECT_ID,
      appId: env.FIREBASE_APP_ID,
    },
  });
};

const actionBody = zfd.formData({
  idToken: z.string(),
  redirectTo: z.string().optional(),
});

export const action = async ({ request }: ActionArgs) => {
  const { idToken, redirectTo } = actionBody.parse(await request.formData());

  await serverAuth.verifyIdToken(idToken);
  return createUserSession({
    request,
    idToken,
    redirectTo: redirectTo ?? "/dashboard",
  });
};

const formValidator = withZod(
  z.object({
    email: zfd.text(z.string().email()),
    password: zfd.text(),
  })
);

export default function Login() {
  const { firebaseOptions } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const auth = useFirebaseAuth(firebaseOptions);
  const fetcher = useFetcher();
  const [error, setError] = useState(false);
  const [params] = useSearchParams();
  const redirectTo = params.get("redirectTo") ?? undefined;

  const signIn = async (email: string, password: string) => {
    try {
      const credential = await signInWithEmailAndPassword(
        auth(),
        email,
        password
      );
      const idToken = await credential.user.getIdToken();

      const body: Record<string, string> = { idToken };
      if (redirectTo) body.redirectTo = redirectTo;
      fetcher.submit({ idToken }, { method: "post" });
    } catch (err) {
      setError(true);
    }
  };

  return (
    <>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex min-h-full flex-col justify-center bg-gray-50 py-12 dark:bg-gray-800 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {error && (
            <Alert
              className="mb-6"
              variant="error"
              details={t("login.loginFailed")}
            />
          )}
          <ValidatedForm
            fetcher={fetcher}
            className="space-y-6"
            validator={formValidator}
            onSubmit={async ({ email, password }, event) => {
              setError(false);
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
              label={t("login.loginButton.label")}
              loadingLabel={t("login.loginButton.loadingLabel")!}
              className="w-full"
            />
          </ValidatedForm>
        </div>
      </div>
    </>
  );
}
