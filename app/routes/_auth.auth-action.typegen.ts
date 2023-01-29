// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    confirmPasswordReset: "done.invoke.authAction.resetPassword.confirm:invocation[0]";
    verifyEmail:
      | "done.invoke.authAction.verifyEmail.verifying:invocation[0]"
      | "done.invoke.authAction.verifyEmail:invocation[0]";
    verifyPasswordReset:
      | "done.invoke.authAction.resetPassword.verifying:invocation[0]"
      | "done.invoke.authAction.resetPassword:invocation[0]";
    verifyRecoverEmail:
      | "done.invoke.authAction.recoverEmail.verifying:invocation[0]"
      | "done.invoke.authAction.recoverEmail:invocation[0]";
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
  eventsCausingActions: {};
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isPasswordReset: "";
    isRecoverEmail: "";
    isVerifyEmail: "";
  };
  eventsCausingServices: {
    confirmPasswordReset: "submitNewPassword";
    verifyEmail: "";
    verifyPasswordReset: "";
    verifyRecoverEmail: "";
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
