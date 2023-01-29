// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "error.platform.password-reset.submitting:invocation[0]": {
      type: "error.platform.password-reset.submitting:invocation[0]";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    sendResetEmail: "done.invoke.password-reset.submitting:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: "sendResetEmail";
  };
  eventsCausingActions: {
    logError: "error.platform.password-reset.submitting:invocation[0]";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    userNotFound: "error.platform.password-reset.submitting:invocation[0]";
  };
  eventsCausingServices: {
    sendResetEmail: "submit";
  };
  matchesStates: "error" | "idle" | "submitting" | "success";
  tags: never;
}
