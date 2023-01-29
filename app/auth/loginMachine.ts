import { createMachine } from "xstate";

export const loginMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBsD2UCWA7AdBiyYAxGlAATZkDuGALgBZlSrqEDaADALqKgAOqWHQyosvEAA9EARgBMAVhzyOK2QBZ1ATgBsAdl1rpAGhABPRLINKVHOdO3bZHfQF8XJ0tjwFipClmo6RjAAWwBDDGROHiQQASFaETFYqQQ5RWVVDTUdfUMTczTZAA4cGxVHaU15eT15Nw90L1JMLHJKGgYmFihCIghRMDwsADdUAGshz1wW7HaAzsZmVjAEbDGAYzDE0Wjo8XjhUXFU2s0cYpLpHK09AwKLWW0ymwBmJ01NYtftTV0GkDTHCzNr+QJdPhhWCwKioABOEH6g2GY0mwKaM3QrXm4MYkOhsIRa1GqC2Oywe24B0ER2SoFOvwuVxuOTuageCGKHBwOU+mlZxWqulkAKBIJxi26KyIYDhcPhOD4yG2ADN4SF0a1NdiwZLlr1VutSdskpSYvwaeSTogzkzitdNLc8hzLK9rCp3hxPt9-u5ARjtXNdUEyPiYfDEbL5XDFcraGq4RqxVigx0Q2HCRBiZsTbtuPtYocrSkbYzLvaWbl7mYZLpSplbAZdLZaq9RQGo-CSOhg119ewqYXLUlrQhtBxFNJirp5K93j9PtpihzPTg+Z9ZLJ3vI62p6n6gZ24d2JSHQhEooOLQkRyWx-YcFOZ08arOquya0VdGv1wKhSKASwVAIDgcRpmpG9jjvABabQOVgl4bHke1tDUNQODQgDGi1fBCAg2lRw0F0lyUb5XnkBRdG0aR5DkNR2y1cVeyWHo8KHSC6UkRB3lKaiKOQxw1DZF1aPdWxZHsRxnCXBjmhTUE0whKFwwRfDi3pbiHyE6cDCdatCmkCdEIqCTqlqGdZNwfAyFoCYwACOEwA2MAMBGSA1NvDTOSeR9aksbIqw-AzimeQwHC+KjtGUH42wPDs5XhDyoK8y5nhoxxdNZZ1P1eZw10yOd9FeYpinkTRYrcIA */
  createMachine({
    id: "login",
    tsTypes: {} as import("./loginMachine.typegen").Typegen0,
    schema: {
      events: {} as
        | {
            type: "log in with email";
            payload: { email: string; password: string };
          }
        | { type: "log in with google" },
      services: {} as {
        "log in with password": { data: string };
        "log in with google": { data: string };
        "verify id token": { data: void };
      },
    },
    states: {
      idle: {
        on: {
          "log in with google": "logging in with google",
          "log in with email": "logging in with password",
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
      },
    },

    initial: "idle",
  });
