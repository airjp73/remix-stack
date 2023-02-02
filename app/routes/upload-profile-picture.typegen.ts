// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
    "xstate.stop": { type: "xstate.stop" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: "beginUpload" | "setErrorFromFileRejection";
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    beginUpload: "fileAccepted";
    clearError: "xstate.stop";
    setErrorFromFileRejection: "fileRejected";
    setErrorFromResponse: "errorReceived";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {};
  matchesStates: "error" | "idle" | "uploading";
  tags: never;
}
