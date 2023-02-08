import { assign, createMachine } from "xstate";
import { createActorContext } from "@xstate/react";
import { z } from "zod";

const storageSchema = z.object({
  theme: z.enum(["light", "dark"]),
});

export type Theme = z.infer<typeof storageSchema>["theme"];

const themeMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBcAWYC2YB0sCesymAxAMaoD2FsYABBAIYBOA1gNoAMAuoqAA7UAlskEUAdrxAAPRAE4AjLOwA2ACwdlAZmWyOADg2bVAGhB5EAVj0B2bACYLHDou3W9NgL4fTaTDnyEJORUNLQANoJQqMicPEggArDCohLxMggKSmqGOvqGJmaIqnrK9qqyFZqa8gaqytaaXj7oWLgERBjEAR20vli05AxiMBCxkonJ4pLpyk7Y6nV6mhx2dtYW9abmCJrW8tgWi3oWdvVO8vKN3iB9OIysZJTUdBFRMdzjQiJTaYiX5QcjrJTtY7CtrFtEGpbLtHLJlDYaucmjcWndmCxHiE6AwAK7IChjeITb6pUDpTLYPY2DhuJzWWTVSEICzaKmOJxaVR2eE6FG3bCvaJY570DFE-hfFLTP5GJSHBF6YH1MFrZk6Ww2RwnCzrWSqBr8tGCyLC4KivEEiUJKU-cmygHKBy04rOA16ArbbQWeYVWQlAwWKz1I1+bCCMTCYjWknS34IS6lJznErWVQXOx6OzM+QcH0cpw8jTlIN2UOtCNRtjyOKSpKkmUJtnJ5yp9PyTPZwoIPYcewczR6JHydSycs4SvIaN2Ws2+tx+1NpPJmr1dud5l2OrYP0VBzA4EcbTj8ORqdsTSz2N26Sy5cptcZrPMjnYFv6JWM+GqCxea5iCgIDgSRbk+ecb3SABaZRmUgn1dwQ3cShPbpMDAyYyVvFkNmwdwO3KblDHkCxmQNOwDhbaw81UTQtz0E97hYdCG3jXMs2wYinQ2BZTiqdVVFUDjnRHKjZAaDgx2uAUhWQZiFyw4jaLfLjlFmD15HWPR1VWex9E0BR3DyLcT0nOSIKKLttgI+YWy3J0wVBFDYCYMzMPSblSg9XZlFzH9aKdZkhwo5M01ohpFT-DwgA */
  createMachine({
    id: "theme",
    tsTypes: {} as import("./themeMachine.typegen").Typegen0,
    predictableActionArguments: true,
    preserveActionOrder: true,

    schema: {
      events: {} as
        | { type: "choose dark" | "choose light" | "choose auto" }
        | { type: "system theme changed"; value: "dark" | "light" },
      context: {
        displayedTheme: undefined as "light" | "dark" | undefined,
      },
    },

    states: {
      system: {
        invoke: {
          src: "listen for system changes",
        },

        entry: ["clear local storage", "set display theme from system"],

        on: {
          "choose dark": "dark",
          "choose light": "light",

          "system theme changed": {
            target: "system",
            internal: true,
            actions: ["show system theme"],
          },
        },
      },

      dark: {
        on: {
          "choose light": "light",
          "choose auto": "system",
        },

        entry: ["override to dark mode", "show dark theme"],
      },

      light: {
        on: {
          "choose dark": "dark",
          "choose auto": "system",
        },

        entry: ["override to light mode", "show light theme"],
      },

      init: {
        always: [
          {
            target: "ssr",
            cond: "is server",
          },
          {
            target: "dark",
            cond: "is overridden to dark mode",
          },
          {
            target: "light",
            cond: "is overridden to light mode",
          },
          "system",
        ],
      },

      ssr: {
        description: `We don't do anything here. Pre-hydration theme is done by a script tag.`,
      },
    },

    initial: "init",
  });

export const {
  Provider: ThemeProvider,
  useActor: useTheme,
  useSelector: useThemeSelector,
} = createActorContext(
  themeMachine.withConfig({
    guards: {
      "is server": () => typeof window === "undefined",
      "is overridden to dark mode": () => localStorage.theme === "dark",
      "is overridden to light mode": () => localStorage.theme === "light",
    },
    actions: {
      "override to dark mode": () => {
        localStorage.theme = "dark";
      },
      "override to light mode": () => {
        localStorage.theme = "light";
      },
      "clear local storage": () => {
        delete localStorage.theme;
      },
      "show dark theme": assign({ displayedTheme: (_) => "dark" }),
      "show light theme": assign({ displayedTheme: (_) => "light" }),
      "show system theme": assign({
        displayedTheme: (_, e) => e.value,
      }),
      "set display theme from system": assign({
        displayedTheme: (ctx) =>
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light",
      }),
    },
    services: {
      "listen for system changes": () => (send) => {
        const query = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) => {
          send({
            type: "system theme changed",
            value: e.matches ? "dark" : "light",
          });
        };
        query.addEventListener("change", handler);
        return () => query.removeEventListener("change", handler);
      },
    },
  })
);
