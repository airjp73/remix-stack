import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useMachine } from "@xstate/react";
import type { FirebaseOptions } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import type { TFunction } from "i18next";
import { useId } from "react";
import { useTranslation } from "react-i18next";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { GoogleIcon } from "~/auth/GoogleIcon";
import { loginMachine } from "~/auth/loginMachine";
import { useFirebaseAuth } from "~/firebase/firebase";
import { Alert } from "~/ui/Alert";
import { Button } from "~/ui/Button";
import { Field, FieldInput } from "~/ui/form/Field";
import { SubmitButton } from "~/ui/form/SubmitButton";

const formValidator = withZod(
  z.object({
    email: zfd.text(z.string().email()),
    password: zfd.text(z.string().min(6)),
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

  const [state, send] = useMachine(loginMachine, {
    services: {
      "log in with google": async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth(), provider);
        return await result.user.getIdToken();
      },
      "log in with password": async (
        _ctx,
        { payload: { email, password } }
      ) => {
        const credential = await createUserWithEmailAndPassword(
          auth(),
          email,
          password
        );
        sendEmailVerification(credential.user);
        return await credential.user.getIdToken();
      },
      "verify id token": async (_ctx, { data: idToken }) => {
        fetcher.submit({ idToken }, { method: "post", action: "/login" });
      },
    },
  });

  const socialLabelId = useId();
  const googleId = useId();

  return (
    <>
      {state.matches("error") && (
        <Alert
          className="mb-6"
          variant="error"
          details={t("login.signupFailed")}
        />
      )}
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {t("login.socialLogin.signupLabel")}
        </p>
        <Button
          variant="google"
          className="w-full space-x-4"
          onClick={() => send("log in with google")}
          aria-labelledby={[socialLabelId, googleId].join(" ")}
        >
          <GoogleIcon />
          <span id={googleId}>{t("login.socialLogin.google")}</span>
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
          event.preventDefault();
          send({ type: "log in with email", payload: { email, password } });
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
          isLoading={state.matches("logging in with password")}
        />
      </ValidatedForm>
    </>
  );
}
