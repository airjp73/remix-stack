import { useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import type { TFunction } from "i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { useFirebaseAuth } from "~/firebase/firebase";
import { serverAuth } from "~/firebase/firebase.server";
import { env } from "~/server/env.server";
import { createUserSession } from "~/session.server";
import { Alert } from "~/ui/Alert";
import { Button } from "~/ui/Button";
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

export const handle = {
  authHeader: (t: TFunction) => t("login.header"),
};

const GoogleIcon = () => (
  <svg
    className="h-6 w-6"
    viewBox="0 0 20 20"
    width="100%"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
  >
    <path
      d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"
      fill="#4285F4"
    ></path>
    <path
      d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"
      fill="#34A853"
    ></path>
    <path
      d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"
      fill="#FBBC05"
    ></path>
    <path
      d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"
      fill="#EA4335"
    ></path>
  </svg>
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

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth(), provider);
      const idToken = await result.user.getIdToken();

      const body: Record<string, string> = { idToken };
      if (redirectTo) body.redirectTo = redirectTo;
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
          details={t("login.loginFailed")}
        />
      )}
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {t("login.socialLogin.label")}
        </p>
        <Button
          variant="google"
          className="w-full space-x-4"
          onClick={signInWithGoogle}
        >
          <GoogleIcon />
          <span>{t("login.socialLogin.google")}</span>
        </Button>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            {t("login.socialLogin.orPasswordLogin")}
          </span>
        </div>
      </div>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm">
              {t("login.rememberMe")}
            </label>
          </div>

          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-500"
            >
              {t("login.forgotPassword")}
            </a>
          </div>
        </div>
        <SubmitButton
          variant="default"
          label={t("login.loginButton.label")}
          loadingLabel={t("login.loginButton.loadingLabel")!}
          className="w-full"
        />
      </ValidatedForm>
    </>
  );
}
