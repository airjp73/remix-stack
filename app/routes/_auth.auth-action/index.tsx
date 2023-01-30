import { useOutletContext, useSearchParams } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useMachine } from "@xstate/react";
import { FirebaseOptions } from "firebase/app";
import {
  applyActionCode,
  checkActionCode,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ValidatedForm } from "remix-validated-form";
import { createMachine } from "xstate";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { useFirebaseAuth } from "~/firebase/firebase";
import { Alert } from "~/ui/Alert";
import { Field, FieldInput } from "~/ui/form/Field";
import { SubmitButton } from "~/ui/form/SubmitButton";
import { Link } from "~/ui/Link";

const searchSchema = zfd.formData({
  mode: z.enum(["resetPassword", "recoverEmail", "verifyEmail"]),
  oobCode: z.string(),
});

const passwordConfirmationValidator = withZod(
  z.object({
    password: z.string().min(8),
  })
);

const authActionMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFgQQMboEsB7AOwDoIxcDZiSBiAbQAYBdRUAByNsNI5AAPRAEYAbAHYyAZgBMADhELm8hROYTpAGhABPRABYDssmNkGAnAFYr8i8ekiAvk51osePuUrVapJiLsSCDcvHQCwggiVlJyisqq8uqaOvoIEiLyMhIG8rbRYmIGti5uGDj4dBRUNHRMskFcPAReEaKSMgpK8ipqGtp67WJkSVbMzCLMVhYWzLJzpSDuFV5kAE5wYOgACsiwsADuRGsQZABuYGsEAGa6BCRQ9BCkYGT3Z0QA1q-LnlUbsC2u32RxO50uNzuDwQ7yIuGQXhYrCRAlCLXCwUihREMmYBgycmkYmk0nkYlShmYFhkJMcVjMRLE0ysi1+lVI602Oz2h2OpwuV1u90elzWxzInAANgjrscALZkNmrAFAnmg-kQoXQ2HwxFsFHBNGtTGIbG4-EiQnE0nkwYIAwdeQk2QiCxOkRGYms8p-Dkq7kgvlkMAkdCXAByYAOwN5J3osFQACM5S1I9G1XyDU0wvwTVFJjjpHizBYii6rEYKQhpDMyDkZpoLNERK7ZN6POzyP6Y+qyLhSNcCGs5U8Xm8SB9voqfZ3OYCA7HTv2SIPhzCJ3CEXQkVmQs1jaBItEm2Q5iTElaMlWbWQZneDBom5YLO2Vv8uT2g8vVyPReKpTK8rTh2yofhmYLfkOcrrh8urbvqbCovuGKHqI0w4mepIKJeIhVgYNa3uIEiyAykiuvIr6+l2YGBhBA5QVupAAGLIAQkqQPGSYpugaaficu5GihQjtLIVidHMYhEXMD62mkFYmM+bpFEYEiqZRs4bP2AoAKJyqxkrgoKUKPM8JCvLCU5Ku+WmXLp+mGZCwowZuerIohhrIbmqEIEy1ISDEEgWOYJKlvSVbqNIZDPjkNpEtYYjqaBNlrHZbEOVqIprGKawStK6CysOwFvn6VBEDpelpQKjnahucGkDu7nZuiXnCT50x1gFQX4TWTKyYgEiSbeMxkmIeKKFMBiJVUVW3KlBkzcZo5meOk4-DOqwLXN6XGc5dUkA1jR7jmJBtD5zDDLIpZ2DW0hWDWExVs2Q13qSJJnm2rhLOt02aroW0LcK9B-jlAH5UBVkcptFXzb9Tk6ox+0IYdgktVi51kJdYjXRYt33bhdouswZBjOMGhzE2mTSC4n0kEQlDwMEEMnR5x2nQAtH1CBs7IkV3nz-MzFTn1M9UvhCSjzPecYj05B14yyDzxjzIoFHC99JXznxEBIazea3Qp50kb0cyBdYVYKNSonjNEPRGOdSRTRrqq0RqRnCjrzWS61D5EzJRuqCbMxWNetYqG9A1BTkD5C2UIHvpr4GnCGYZrLxicewerWzETIgZPITqJKoRJ4SoNJvfY+I9LnjvUQnLt9vRw4Z0JR6OFIfOibMTLSBI14DXLczmKphRmDXc7O4uZAJrguBwAzTWZ0e8jGKe0Q2IF0gOjzAxpKSYl80ksxxDEY-donDcrgxXgsWxkDN6jojLyYEw2DEONbySeFGMTpMTFSOM9DUmrOOTsFy9mBvfL2kRs5kFzpkAuCgi6cwdMMJ0zoSL4TsFjFkwDirUWSnNSBp0iSRVzhYdQo0VZmAMFWSSBhnp2HOlYUSMRJq4KopyAh0NtruxZp7U6BgWywMChQlQmRqHhR5hjSwgVmFiBmPMF87CNKlXKvZaes99hELzPnYYRZ8RTGsGIuY4U5hRWGiggaHpJKn1UbZbhEC+GL0QLo806hmTGNkOFUaz1-IqCdEFJkY8ob6W0d5W61IyJ5AkE6Yo8haGRUUj0N0pIZhFGCb9f6sMHhhO9hoUwecYixNsDLHE9YZgaGKFSFsGSjJbQ0XPXJkQYkmEYUUVQSgzCSEemMZ6boBoxGPLUyEW1HELxbv1VQIwu65BdCREivcCZUh-r-PIcgKwqGpk4IAA */
  createMachine({
    id: "authAction",
    initial: "decision",
    tsTypes: {} as import("./index.typegen").Typegen0,

    schema: {
      events: {} as {
        type: "submitNewPassword";
        payload: { password: string };
      },
      context: {} as {
        email?: string;
      },
      services: {} as {
        verifyPasswordReset: { data: string };
        verifyEmail: { data: void };
        verifyRecoverEmail: { data: void };
        confirmPasswordReset: { data: void };
      },
    },

    states: {
      decision: {
        always: [
          {
            target: "resetPassword",
            cond: "isPasswordReset",
          },
          {
            target: "recoverEmail",
            cond: "isRecoverEmail",
          },
          {
            target: "verifyEmail",
            cond: "isVerifyEmail",
          },
        ],
      },

      resetPassword: {
        states: {
          verifying: {
            invoke: {
              src: "verifyPasswordReset",
              onDone: "enterNewPassword",
              onError: "error",
            },
          },

          enterNewPassword: {
            on: {
              submitNewPassword: "confirm",
            },
          },

          confirm: {
            invoke: {
              src: "confirmPasswordReset",
              onDone: "success",
              onError: "confirmationFailed",
            },
          },

          success: {},

          confirmationFailed: {
            on: {
              submitNewPassword: "enterNewPassword",
            },
          },

          error: {},
        },

        initial: "verifying",
      },

      recoverEmail: {
        states: {
          verifying: {
            invoke: {
              src: "verifyRecoverEmail",
              onDone: "success",
              onError: "error",
            },
          },

          success: {},
          error: {},
        },

        initial: "verifying",
      },

      verifyEmail: {
        states: {
          verifying: {
            invoke: {
              src: "verifyEmail",
              onDone: "success",
              onError: "error",
            },
          },

          success: {},
          error: {},
        },

        initial: "verifying",
      },
    },
  });

export default function AuthAction() {
  const { t } = useTranslation();
  const { firebaseOptions } = useOutletContext<{
    firebaseOptions: FirebaseOptions;
  }>();
  const auth = useFirebaseAuth(firebaseOptions);

  const [params] = useSearchParams();
  const { mode, oobCode } = searchSchema.parse(params);
  const [state, send] = useMachine(authActionMachine, {
    guards: {
      isPasswordReset: () => mode === "resetPassword",
      isRecoverEmail: () => mode === "recoverEmail",
      isVerifyEmail: () => mode === "verifyEmail",
    },
    services: {
      verifyPasswordReset: () => verifyPasswordResetCode(auth(), oobCode),
      verifyEmail: async () => {
        try {
          await checkActionCode(auth(), oobCode);
          await applyActionCode(auth(), oobCode);
        } catch (err) {
          console.log(err);
          throw err;
        }
      },
      verifyRecoverEmail: async () => {
        await checkActionCode(auth(), oobCode);
        await applyActionCode(auth(), oobCode);
      },
      confirmPasswordReset: (ctx, event) =>
        confirmPasswordReset(auth(), oobCode, event.payload.password),
    },
  });

  if (
    state.matches("verifyEmail.error") ||
    state.matches("recoverEmail.error") ||
    state.matches("resetPassword.error")
  )
    return (
      <>
        <Alert
          variant="error"
          details={
            <div className="space-y-2">
              <p>{t("authActions.invalidCode")}</p>

              <Link href="/login" className="block">
                {t("authActions.backToLoginLink")}
              </Link>
            </div>
          }
        />
      </>
    );

  if (state.matches("verifyEmail.success"))
    return (
      <>
        <Alert
          variant="success"
          details={
            <div className="space-y-2">
              <p>{t("authActions.emailVerified")}</p>

              <Link href="/login" className="block">
                {t("authActions.backToLoginLink")}
              </Link>
            </div>
          }
        />
      </>
    );

  if (state.matches("recoverEmail.success"))
    return (
      <>
        <Alert
          variant="success"
          details={
            <div className="space-y-2">
              <p>{t("authActions.emailRestored")}</p>

              <Link href="/login" className="block">
                {t("authActions.backToLoginLink")}
              </Link>
            </div>
          }
        />
      </>
    );

  if (state.matches("resetPassword.success"))
    return (
      <>
        <Alert
          variant="success"
          details={
            <div className="space-y-2">
              <p>{t("authActions.passwordChanged")}</p>

              <Link href="/login" className="block">
                {t("authActions.backToLoginLink")}
              </Link>
            </div>
          }
        />
      </>
    );

  if (
    state.matches("resetPassword.enterNewPassword") ||
    state.matches("resetPassword.confirm")
  )
    return (
      <ValidatedForm
        className="space-y-6"
        validator={passwordConfirmationValidator}
        onSubmit={(data, event) => {
          event.preventDefault();
          send({ type: "submitNewPassword", payload: data });
        }}
      >
        <Field name="password" label={t("authActions.newPasswordLabel")}>
          <FieldInput type="password" />
        </Field>
        <SubmitButton
          variant="default"
          isLoading={state.matches("resetPassword.confirm")}
          label={t("authActions.updatedPasswordButton.label")}
          loadingLabel={t("authActions.updatedPasswordButton.loadingLabel")!}
          className="w-full"
        />
      </ValidatedForm>
    );

  return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
}
