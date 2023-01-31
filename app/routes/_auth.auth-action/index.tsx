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
import { createMachine, send as sendAction } from "xstate";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { isomorphicEnv } from "~/env/env";
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
  /** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFgQQMboEsB7AOwDoAnOMdABWVlgHciKIyA3MCggMwE8CJKAGIIpMGSEciAa0loseQqUrU6DZq3ZceAoVATSiuZCpIBtAAwBdazcSgADkVgFzjkAA9EAdl8AbGS+ACwAnBFWAExhABxxUQA0IPyIAb5RZLEAzLkAjFEBsVZhIQCsvgC+lcmKOPjE5FSwNPSMLGyc3HyCwiLcFKxkTgA2ZrysALZkdcqNai0a7dpder2Gxqbm9vaeLm4eSN5+gcHhkTHxsUkpftl5ZLlPVjn3Ydlh1bUY9eYLrZoOuwwCR0NwAHJgJhtLRsESwVAAI0m7kh0MB2l2R327kanh8CAKeSCgTKARCxKsRSivliyVSCACAWyZCi5wCFRebLKXxAswaqmaAOWnVwpF4BAokzEEikJBk8hmPzmgvUMKBZDFJAlUqM8pMZkaO1se1cuNI+MQeV8VLI51iNptbJCVjy9LSZSsdoiYX8eTivmyUVivP5fyFS1h7C1OulAyGo3GUyVSgFTTVGNF4slkz1Mi2RtsWOcZsOoAJ1tt9sd0RCLrdtwQNpZFKZZXiYSiNOyoeVaf+kY1MZzhtIADFkAQRpB4UiUeg0erMSbsaW8UcK6Evb4wukQtTHeV3QhimUyD7d9krLTfGUwjyany++GwGLdABRSaTkarHoGGUkJIxiKmG8xUG+3Cft+v76MIeYGtsRYriWBzruWfgclkITZBkISFFYVhlEGx55GUmQEQReTRKRgQBFEvapi+EEUFBU4wes-QUIMFDDGM6ATFKKa-GBr5EB+X5sbof5wZso6WEhDirqhFobhhZ6xNhuH4YRxGNlEVHehEZEvHedafI+oGqFJAisT+1kceIgFygqCjPvM9m2exBjwQWpDGopKHmiQlqMukdpEdeETZK8DYMtFQQ+rEZQUiEgR5FeAQMcJVndDZEl2blHHxjxib8cmlnkB5+VeTJ+q+fJdjISAOJlscoW+OFV47u8MXHnWZ7nKUSWxP6GUPt8jHzBAr4EG4pAiF+JCoMgIwAARCO4xbNWuKnoYSYVBiN0XYQRxQ5H1LzBHEARhFSMQFByWUquQ024LNjQLcgS0retJCbXkAXbcpwWqYSFSPMG6UaVeLwvNkx7NlkoTvHevikbERRPf2r3vfNi3LWtG3oBYUSAy1aFtcSHWHVDJ2w+djbEiEZB0eEGNBslRFJdUj4kEQ03wEcFWmsDIUALRBPp5LYVE0XtlR2QBMeYuy+ePoZGR-hsul9EWW5qg43NIOBa1BIUsEORlGSaUUvE5IkWjZwRKlrrowUVR65NqqLEubAi0FIX7h10OBp2xQUnkdKNlbmS3gRZT+vuZIjVjL4+5mOiFQY-um4gCfqZpHzBlYEdRwyTKZO2+TBruVKhKnInpyKwKghCUK+xAOcUxWrpnnRnpWNk+5D1RITHukDyvFeURUjdREN97wpRpq2ZSl3u2U9hLZFIGgZ3cUvjjy6rLnP4FJy-uC-pk3y8IrguBwILJvd1a94dfaeFkRyNKxWk4SGbuDkGkty6wmtla+S8hyry-OYCcU5IDr2NpTN+hkNJRC-prX+TZrxqwiMAxWcQNJXwHB3MgxVEEhSoqRFm6CCJD2ZBSEuCMryPCeDPfSnZXbEPAmJSC+UKGg33GEVkA8SiegiAEV0Y9GzMjIKImG58h4lG4aJcS0F7LZyUgHUGCcOq0IIveEotcsHWgeMje8LpkqER3io5ink74P0YAIvaERMgujomfaK15pEMlIg8Ci152w5DQXEWxvCWLVXIVo3OCBXF2jup4g+PjEAz2EYNFKaN7xS2IVVb8zi2p4S9CNdB6CRrYQTkyY8NcREUV0bea0TIcmFU8ho4Q+SzZFCyAUMi8tynEiVo2HCJJzgZTrOHUBT4vaVWadVBxj92mIA0szO6qU2S3VlmXRActcFhH9CNZOoTPbgPYp5KJz8N4EiWWQFZuF1nRT6nWABOFdw7meR7aoQA */
  createMachine(
    {
      id: "authAction",
      initial: "decision",
      tsTypes: {} as import("./index.typegen").Typegen0,

      schema: {
        events: {} as
          | {
              type: "submitNewPassword";
              payload: { password: string };
            }
          | { type: "manual init" },
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
          on: {
            "manual init": [
              {
                target: "verifyEmail",
                cond: "isVerifyEmail",
              },
              {
                target: "resetPassword",
                cond: "isPasswordReset",
              },
              {
                target: "recoverEmail",
                cond: "isRecoverEmail",
              },
            ],
          },

          entry: "strictSafeInit",
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
    },
    {
      actions: {
        // This prevents the machien from running twice in strict mode
        strictSafeInit: sendAction({ type: "manual init" } as any, {
          delay: isomorphicEnv.NODE_ENV === "development" ? 0 : undefined,
        }),
      },
    }
  );

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
