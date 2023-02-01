// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "error.platform.fileUpload.uploading:invocation[0]": {
      type: "error.platform.fileUpload.uploading:invocation[0]";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
    "xstate.stop": { type: "xstate.stop" };
  };
  invokeSrcNameMap: {
    uploadFile: "done.invoke.fileUpload.uploading:invocation[0]";
  };
  missingImplementations: {
    actions: "clearError" | "setErrorFromFileRejection" | "setErrorFromUnknown";
    delays: never;
    guards: never;
    services: "uploadFile";
  };
  eventsCausingActions: {
    clearError: "xstate.stop";
    setErrorFromFileRejection: "fileRejected";
    setErrorFromUnknown: "error.platform.fileUpload.uploading:invocation[0]";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    uploadFile: "fileAccepted";
  };
  matchesStates: "error" | "idle" | "success" | "uploading";
  tags: never;
}
