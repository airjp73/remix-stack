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
  /** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFgQQMboEsB7AOwDoIxcDZiSBiAbQAYBdRUAByNsNI5AAPRAEYAbAHYyAZgBMADhEiJ0gCyTZzAJwAaEAE9EAVhHSyI2UebiJY5mItGAvk71osePuUrVapJiLsSCDcvHQCwggiRlJyispqGtp6hgjy0kZk8hJW8lqq0iLyqvIubhg4+HQUVDR0TLJBXDwEXhGikjIKSirqEpq6BqJazDI51vLysqoKRloSZSDulV5kAE5wYOgACsiwsADuRGsQZABuYGsEAGb6BCRQ9BCkYGT3Z0QA1q-LntUbsC2u32RxO50uNzuDwQ7yIuGQXhYrCRAlCrXCwUiYgcMmY6nkcwkWjEmjEKWMzDM0mpGRMshEqnyWmcriWFT+pHWmx2e0Ox1OYBI6EuADkwAdgXyTvRYKgAEYAW1aYolvNBEBRwTRbUxohE1lx6i0CgcI2p5IQjLM4zx0QKTJZ5Q8VU5AKBav5ZFwpGuBDWCqeLzeJA+3zIvxd5DdPJBnu9JF9-phIbhCLoSM1zTC-F1UTmIjIzFkGQkpfU5aMFpKBeYtcphWsVsdbOdq2jkvVXp9foDlzWxzInAANgjrscFeH2ZGuYCY1LTvHEwrkx94Yi2JmQi0daBItEtDXizEy2IKxajNSyAfsVoMgySczFhG29yO3Hu-606QAGLIAhDyAZXlJV0BVN8Tk3bUMV3DpLC6PFTxGWR6VUC0xGkMQyCsWtVEpCRmHkawFlZZ9-ioIgLjWABRBU-yHcErlue5HmeEhXlhMNSNdcjKJouiGMhZiV1TddkTYVFt2goREDEOYyByUtinUZDtAkC0CWtbDbyJGJJCfKcX29XjaP-ASmIeeg+wHYdR3HSdWzIozLj40zKME6FYTXdMN3ErVJJzGCEFkrR5OPJSSQGNShgQA9ZDISxrGYFRb2icR9Iczk3NuFz6KyqEWKDDifgM6o8pysz8uErzSAzXys3RALpKC+x4uJbJcNkCQSiMMlopELQQrrItVGUVRkuUdKVlKiFspM3KZvyyy1n7NZBxHdAx39eypsyhbyryoTPK-EhaqaLdsxIdpmsw2Q2q6osuoJXrUksKRsJwwiCNw1RJo5KNXw9MEDosqzVpsja7K4-7Z3A05gagKrjtOiSLquoxJnMaY5gwsbTxyc8MZpalmCMGZpCLMQXFZEgiEoeBgihlGGsu3MAFpnsQVniyvAbmVJ5CcjpX7px8OpGqgxrIhmC1+vkeLsOiMQDwsHDhZfGHAYgJmdyajI4twkkjHRsRJhiHqLWpG7GV5-JlAZLQ1bIjXYyBhbmO1qSpdrMgDcsY3TZyDnLQkOX0mpUm1HpHrHe4535zIQVhTWMDNY9yXEBGUY7cmU9ClLBRzyLGQaX6LreksGPofdF2Fw-BU05ZwLTCKQs6ysEwBtLKt8NC2ti1MbJ0Mrmdq-j2VcFwOB6fqnW92KOLrDmBR7HSfIotSEpRiG6YMkpBkfpIkrY9HztFx7Y7f3-SAG6uooZkLfdl5N6Q1-PaQ5fe6QiVxgbh42JzqJzRvrmDCZhlDEnyPSdIOcLT4UGnWOw6E5iTGkH-Hizk5oVXdn5VGuYRoFnAUrGYRR37yCDsUMw71oHEwwpTQ+GV-oAPKuPSe+xgGBRzoaU8VgxrS2igSOKNoCR4lUOjIkaCmGYNBuwpqnDyYVjxF1WQFplby1rFoMhI15gV3oTtcgZUgE4OZldDIIVJBFEQUofIcg0KULrLMEaDgv5pV0X9Cq+03YPBkV7KQ5iyH2CsQUZR0UoG91rJMAi-QiiyGHgY-iLCp7eMQCHOKeR7Ak0pJSU8MsNGtz7poZQigNCxL2lI5axwkkIBSVkEYdgrDkxxhaSwmF3rIRmNibIDtXHTnbJrBO5S1iVPSKMfo2gX4jG+tINC3NNCKAkEUAkBIJpUyAA */
  createMachine({
    id: "authAction",
    initial: "decision",
    tsTypes: {} as import("./_auth.auth-action.typegen").Typegen0,

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
        invoke: {
          src: "verifyPasswordReset",
        },

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
        invoke: {
          src: "verifyRecoverEmail",
        },

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
        invoke: {
          src: "verifyEmail",
        },

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
      verifyEmail: () => applyActionCode(auth(), oobCode),
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
          variant="error"
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
          variant="error"
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
