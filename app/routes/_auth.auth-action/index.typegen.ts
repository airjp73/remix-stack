// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    confirmPasswordReset: "done.invoke.authAction.resetPassword.confirm:invocation[0]";
    verifyEmail: "done.invoke.authAction.verifyEmail.verifying:invocation[0]";
    verifyPasswordReset: "done.invoke.authAction.resetPassword.verifying:invocation[0]";
    verifyRecoverEmail: "done.invoke.authAction.recoverEmail.verifying:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: "isPasswordReset" | "isRecoverEmail" | "isVerifyEmail";
    services:
      | "confirmPasswordReset"
      | "verifyEmail"
      | "verifyPasswordReset"
      | "verifyRecoverEmail";
  };
  eventsCausingActions: {
    strictSafeInit: "xstate.init";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isPasswordReset: "manual init";
    isRecoverEmail: "manual init";
    isVerifyEmail: "manual init";
  };
  eventsCausingServices: {
    confirmPasswordReset: "submitNewPassword";
    verifyEmail: "manual init";
    verifyPasswordReset: "manual init";
    verifyRecoverEmail: "manual init";
  };
  matchesStates:
    | "decision"
    | "recoverEmail"
    | "recoverEmail.error"
    | "recoverEmail.success"
    | "recoverEmail.verifying"
    | "resetPassword"
    | "resetPassword.confirm"
    | "resetPassword.confirmationFailed"
    | "resetPassword.enterNewPassword"
    | "resetPassword.error"
    | "resetPassword.success"
    | "resetPassword.verifying"
    | "verifyEmail"
    | "verifyEmail.error"
    | "verifyEmail.success"
    | "verifyEmail.verifying"
    | {
        recoverEmail?: "error" | "success" | "verifying";
        resetPassword?:
          | "confirm"
          | "confirmationFailed"
          | "enterNewPassword"
          | "error"
          | "success"
          | "verifying";
        verifyEmail?: "error" | "success" | "verifying";
      };
  tags: never;
}
