import { assign, createMachine } from "xstate";

export const loginMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBsD2UCWA7AdBiyYAxGlAATZkDuGALgBZlSrqEDaADALqKgAOqWHQyosvEAA9EARgBMAVhzyOK2QBZ1ATgBsAdl1rpAGhABPRLINKVHOdO3bZHfQF8XJ0tjwFipClmo6RjAAWwBDDGROHiQQASFaETFYqQQ5RWVVDTUdfUMTczTZAA4cGxVHaU15eT15Nw90L1JMLHJKGgYmFihCIghRMDwsADdUAGshz1wW7HaAzsZmVjAEbDGAYzDE0Wjo8XjhUXFU2s0cYpLpHK09AwKLWW0ymwBmJ01NYtftTV0GkDTHCzNr+QJdZa9YhgABOMNQMJwfGQ2wAZgiQsCmjN0K15uClj1CGtRqgtjssHtuAdBEdkqBTr8Llcbjk7moHghLK9rCp3hxPt9-u5AdisVA8WDFmQ+GFYLAqAiIP1BsMxpNxc1cXMpUEZXKFUqSZttkkqTF+LSKSdEGdmcVrppbnlOcUODgcp9NGzitVdLIAUCQfjpbL5YqYcrYfDEci0RjNTiJTqOnqw4bI8ayabdtx9rFDtaUramZcHazcvczDJdKVMrYDLpbLVXoGxdGESR0LqIUSwPnLQkkjaENoOIppMVdPJXu8fp9tMVOfycF7PrJZO95LW1PURUCOzCuyG9aEIlFqQWrcPi6P7DhJ9OnjUZ1UOdWirpV2ufX6AwCsFQCA4HEaYaSHY5bwAWm0TkoK-coN3kOQOEXXRJzbVpvEIcC6RHDROSeOtvleeQFF0bRpGQ9RMK1ZNQVTXsVlwosGUQd5Skosj5GKRw1HZQjkN5WxZHsRxnEXWik0lRjGHTCMIBYm82IQV5734qcDGdKtCmkccXhsSpqlqacpO8MhaAmMAAhhMANjADARkgJTIJUy5nioxwtLZF0P0nZ5DAcL4KO0ZQflbfd2zhBEXPpSREHch9aksbJK3fQpXmcVdMlnfRXmKYp5E0CK3CAA */
  createMachine(
    {
      predictableActionArguments: true,
      id: "login",
      tsTypes: {} as import("./loginMachine.typegen").Typegen0,
      schema: {
        events: {} as
          | {
              type: "log in with email";
              payload: { email: string; password: string; remember?: boolean };
            }
          | { type: "log in with google" },
        services: {} as {
          "log in with password": { data: string };
          "log in with google": { data: string };
          "verify id token": { data: void };
        },
        context: {} as { remember?: boolean; error?: unknown },
      },
      states: {
        idle: {
          on: {
            "log in with google": "logging in with google",
            "log in with email": {
              target: "logging in with password",
              actions: "set remember",
            },
          },
        },

        "logging in with google": {
          invoke: {
            src: "log in with google",
            onDone: "id token received",
            onError: "error",
          },
        },

        "logging in with password": {
          invoke: {
            src: "log in with password",
            onDone: "id token received",
            onError: "error",
          },
        },

        "id token received": {
          invoke: {
            src: "verify id token",
          },
        },

        error: {
          on: {
            "log in with google": "logging in with google",
            "log in with email": "logging in with password",
          },

          entry: "set error",
        },
      },

      initial: "idle",
    },
    {
      actions: {
        "set remember": assign((ctx, ev) => ({
          remember: ev.payload.remember,
        })),
        "set error": assign((ctx, ev) => ({ error: ev.data })),
      },
    }
  );
