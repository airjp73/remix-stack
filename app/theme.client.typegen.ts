// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    "listen for system changes": "done.invoke.theme.system:invocation[0]";
  };
  missingImplementations: {
    actions:
      | "clear local storage"
      | "override to dark mode"
      | "override to light mode"
      | "set display theme from system"
      | "show dark theme"
      | "show light theme"
      | "show system theme"
      | "update theme in dom";
    delays: never;
    guards: "is overridden to dark mode" | "is overridden to light mode";
    services: "listen for system changes";
  };
  eventsCausingActions: {
    "clear local storage": "" | "choose auto" | "system theme changed";
    "override to dark mode": "" | "choose dark";
    "override to light mode": "" | "choose light";
    "set display theme from system":
      | ""
      | "choose auto"
      | "system theme changed";
    "show dark theme": "" | "choose dark";
    "show light theme": "" | "choose light";
    "show system theme": "system theme changed";
    "update theme in dom":
      | ""
      | "choose auto"
      | "choose dark"
      | "choose light"
      | "system theme changed";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    "is overridden to dark mode": "";
    "is overridden to light mode": "";
  };
  eventsCausingServices: {
    "listen for system changes": "" | "choose auto" | "system theme changed";
  };
  matchesStates: "dark" | "init" | "light" | "system";
  tags: never;
}
