import { useMachine } from "@xstate/react";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import type { TFunction } from "i18next";
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
import { useFirebaseOptions } from "~/utils";
import { makeValidator } from "~/validation";

export const handle = {
  authHeader: (t: TFunction) => t("resetPassword.header"),
};

const validator = makeValidator({
  email: zfd.text(z.string().email()),
});

const resetMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAcCGtYHcD2AnCAtLnGAC4B0sArgEYC2AlqaQwHZQDEE2rY5bAN2wBrPmgw58REhWr0mLdgkHYAxqhY8A2gAYAurr2IU2WEwY9jIAB6IALADYATOQDMDgJwBWAOw6fTjoedl52ADQgAJ6IAIx2ABzkPq5eDq5O7h4xOl6urgC++RHiWHiExLBklLSMzGycYLi4eOTIADYaAGZ4dK3opVIVVXK1ilDKrELqmqyGhlbIpuaWSDaIrvE+5PGeXvEeTg5eHq4xMV4R0QhOMR7ktx465+52ryGFxf2S5TLV8nXsDiNZq4VodUjdXC9ErfaSVWQ1BT1CZTDQWWb6LQxIyrRZmGZWWwIVweO52Hz7OzZeK+JzxVw+S7rG7kDI6G7OVx2PJ+OwfEAwspwsgcEZMea4pYE1ZEuxOJkIGI+LzkBxPXJ0nRHfwOByFIogVjYCBwBZfIVDUgLKXowmIAgOBWuHSq9V0pzJLwe3zxfmCwa-BgQNpga3420yxChe7eZ3xdkZKl7BVnLbZZ6a7U+XV+80B+F-Ub1MPLVh2xXR-ZamJq14Oek1lNe13nD0xeLxwJ5XMSC2-aiqVRweCS8MrUBE+MuzYHDwBbJHVIptKshxyna7EnKpw9gY-AvAvAl6UTxDxGKue5U9UeNWLx1RdZypJaim3tc7Ll8-VAA */
  createMachine(
    {
      id: "password-reset",

      schema: {
        events: {} as { type: "submit"; payload: { email: string } },
        services: {} as {
          sendResetEmail: { data: void };
        },
        context: {} as { error?: string },
      },

      tsTypes: {} as import("./index.typegen").Typegen0,
      context: {},

      states: {
        idle: {},

        submitting: {
          invoke: {
            src: "sendResetEmail",
            onDone: "success",
            onError: [
              {
                target: "success",
                cond: "userNotFound",
              },
              {
                target: "error",
                actions: "logError",
              },
            ],
          },
        },

        success: {},
        error: {},
      },

      initial: "idle",

      on: {
        submit: ".submitting",
      },
    },
    {
      actions: {
        logError: (_context, { data }) => {
          console.log(data);
        },
      },
      guards: {
        userNotFound: (_context, { data }) => {
          if (data instanceof FirebaseError) {
            return data.code === "auth/user-not-found";
          }
          return false;
        },
      },
    }
  );

export default function PasswordReset() {
  const { t } = useTranslation();
  const firebaseOptions = useFirebaseOptions();
  const auth = useFirebaseAuth(firebaseOptions);
  const [state, send] = useMachine(resetMachine, {
    services: {
      sendResetEmail: async (_context, { payload: { email } }) => {
        await sendPasswordResetEmail(auth(), email);
      },
    },
  });

  return (
    <>
      {state.matches("success") && (
        <Alert
          variant="success"
          title={t("resetPassword.successMessage")}
          details={
            <Link href="/login" className="block">
              {t("authActions.backToLoginLink")}
            </Link>
          }
        />
      )}
      {state.matches("error") && (
        <Alert variant="error" title={t("resetPassword.errorMessage")} />
      )}
      <ValidatedForm
        className="space-y-6"
        validator={validator}
        onSubmit={({ email }, event) => {
          event.preventDefault();
          send({ type: "submit", payload: { email } });
        }}
      >
        <Field name="email" label={t("login.emailLabel")}>
          <FieldInput />
        </Field>
        <SubmitButton
          variant="default"
          label={t("resetPassword.submitButton.label")}
          loadingLabel={t("resetPassword.submitButton.loadingLabel")}
          className="w-full"
          isLoading={state.matches("submitting")}
        />
      </ValidatedForm>
    </>
  );
}
