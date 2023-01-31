import {
  useFetcher,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { useMachine } from "@xstate/react";
import type { FirebaseOptions } from "firebase/app";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import type { TFunction } from "i18next";
import { useId } from "react";
import { useTranslation } from "react-i18next";
import { ValidatedForm } from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { GoogleIcon } from "~/auth/GoogleIcon";
import { loginMachine } from "~/auth/loginMachine";
import { useFirebaseAuth } from "~/firebase/firebase";
import { serverAuth } from "~/firebase/firebase.server";
import { get_or_create_user } from "~/models/user.server";
import { createUserSession } from "~/session.server";
import { Alert } from "~/ui/Alert";
import { Button } from "~/ui/Button";
import { Field, FieldInput } from "~/ui/form/Field";
import { SubmitButton } from "~/ui/form/SubmitButton";
import { Link } from "~/ui/Link";
import { makeValidator } from "~/validation";

const actionBody = zfd.formData({
  idToken: z.string(),
  redirectTo: z.string().optional(),
  remember: z.boolean().optional(),
});

export const action = async ({ request }: ActionArgs) => {
  const { idToken, redirectTo, remember } = actionBody.parse(
    await request.formData()
  );

  const { email, uid } = await serverAuth.verifyIdToken(idToken);
  invariant(email, "User login must have an email");

  await get_or_create_user({ email, firebase_uid: uid });
  return createUserSession({
    request,
    idToken,
    remember,
    redirectTo: redirectTo ?? "/dashboard",
  });
};

const formValidator = makeValidator({
  email: zfd.text(z.string().email()),
  password: zfd.text(),
});

export const handle = {
  authHeader: (t: TFunction) => t("login.header"),
};

export default function Login() {
  const { t } = useTranslation();
  const { firebaseOptions } = useOutletContext<{
    firebaseOptions: FirebaseOptions;
  }>();
  const auth = useFirebaseAuth(firebaseOptions);
  const fetcher = useFetcher();
  const [params] = useSearchParams();
  const redirectTo = params.get("redirectTo") ?? undefined;

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
        const credential = await signInWithEmailAndPassword(
          auth(),
          email,
          password
        );
        return await credential.user.getIdToken();
      },
      "verify id token": async (ctx, { data: idToken }) => {
        const body: Record<string, string> = { idToken };
        if (redirectTo) body.redirectTo = redirectTo;
        if (ctx.remember) body.remember = "true";
        fetcher.submit(body, { method: "post" });
      },
    },
  });

  const socialLabelId = useId();
  const googleId = useId();

  return (
    <>
      <div>
        <p
          id={socialLabelId}
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {t("login.socialLogin.label")}
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
          <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-300">
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
            <Link href="/password-reset">{t("login.forgotPassword")}</Link>
          </div>
        </div>
        {state.matches("error") && (
          <Alert
            className="mb-6"
            variant="error"
            details={t("login.loginFailed")}
          />
        )}
        <div>
          <SubmitButton
            variant="default"
            label={t("login.loginButton.label")}
            loadingLabel={t("login.loginButton.loadingLabel")!}
            className="w-full"
            isLoading={state.matches("logging in with password")}
          />
          <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("login.noAccount")}{" "}
            <Link href="/signup">{t("login.signupLink")}</Link>
          </p>
        </div>
      </ValidatedForm>
    </>
  );
}
