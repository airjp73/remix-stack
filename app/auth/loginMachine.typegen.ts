// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.login.logging in with google:invocation[0]": {
      type: "done.invoke.login.logging in with google:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.login.logging in with password:invocation[0]": {
      type: "done.invoke.login.logging in with password:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    "log in with google": "done.invoke.login.logging in with google:invocation[0]";
    "log in with password": "done.invoke.login.logging in with password:invocation[0]";
    "verify id token": "done.invoke.login.id token received:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: "log in with google" | "log in with password" | "verify id token";
  };
  eventsCausingActions: {};
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    "log in with google": "log in with google";
    "log in with password": "log in with email";
    "verify id token":
      | "done.invoke.login.logging in with google:invocation[0]"
      | "done.invoke.login.logging in with password:invocation[0]";
  };
  matchesStates:
    | "error"
    | "id token received"
    | "idle"
    | "logging in with google"
    | "logging in with password";
  tags: never;
}
