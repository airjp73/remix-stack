import invariant from "tiny-invariant";
import { assign, createMachine, interpret } from "xstate";
import { z } from "zod";

const storageSchema = z.object({
  theme: z.enum(["light", "dark"]),
});

export type Theme = z.infer<typeof storageSchema>["theme"];

export const getInitiallyDisplayedTheme = (): Theme => {
  invariant(
    localStorage,
    "Can only access the theme on the client. Consider wrapping the component in a `ClientOnly`."
  );

  try {
    const { theme } = storageSchema.parse(localStorage);
    return theme;
  } catch (err) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
};

const themeMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBcAWYC2YB0sCesymAxAMaoD2FsYABBAIYBOA1gNoAMAuoqAA7UAlskEUAdrxAAPRAHYAjAE5sADhUAmFRwAsHefI0qArABoQeRNvWzsRowDZNRxYvsrZsgL6ezaTDnxCEnIqGloAG0EoVGROHiQQAVhhUQkEmQQFZTVNHT0DJzMLBABmdXtbBwNFMt0jHW9fdCxcAiIMYkD22j8sWnIGMRgIOMkklPFJDO1tCrKOdUVZcqN1eTcixHUODmwd-Y4jEp0VeRKvHxBenEZWMkpqOkjo2O4xoRFJ9MR9bWVZex2dQlZwqewKTYIbTGWzyWb6cH2DglJaNK7NG7MFj3UJ0BgAV2QFFGCXGnzSoAyWWwrg4NW0R3simhpnMiHONkOjlkh3WCyM8guTX82GeMRxj3oWJJ-A+qSmPzh-0BqxBijBELZCEZezh3PkDhUigNaOuoqi4pCkoJRJliTlX0pir+qm0ILU2nk5Tc6kh2yMqg49gMBpUJUcDNNGOwgjEwmIdrJ8u+CC9Ab+LkUmmNZxqikhdl2dnsxw0rk0sm0UZFsfjbHk8VlyXJCtT6nTmazRv0KJRkNOtgOshKf2R6pK1ZateQCfUjftzeTTrbHcz2Z7echI5swMUzj3ujpzO8lzEFAgcEk13ei8d0kQAFp7JCn5OAm1MDeJhT71CDTSjjOFFkR5eQt00bBdBLOlllkY17BmN9sFuFgvxbFMcmwYCjGWP5HAQsCtVmbQaRKM4FnbXRyhNS4zTFZA0KXX8gPUbBrBKEEPGZdRFlZYo3RUbA3HI9QrEBcMhXRGs4wY0kHR-aZfS1Ed0yNYNZDDexESrE8gA */
  createMachine({
    id: "theme",
    tsTypes: {} as import("./theme.client.typegen").Typegen0,
    predictableActionArguments: true,
    preserveActionOrder: true,

    schema: {
      events: {} as
        | { type: "choose dark" | "choose light" | "choose auto" }
        | { type: "system theme changed"; value: "dark" | "light" },
      context: {
        displayedTheme: "light" as "light" | "dark",
      },
    },

    states: {
      system: {
        invoke: {
          src: "listen for system changes",
        },

        entry: ["clear local storage"],

        on: {
          "choose dark": "dark",
          "choose light": "light",

          "system theme changed": {
            target: "system",
            internal: true,
            actions: ["show system theme", "update theme in dom"],
          },
        },
      },

      dark: {
        on: {
          "choose light": "light",
          "choose auto": "system",
        },

        entry: [
          "override to dark mode",
          "show dark theme",
          "update theme in dom",
        ],
      },

      light: {
        on: {
          "choose dark": "dark",
          "choose auto": "system",
        },

        entry: [
          "override to light mode",
          "show light theme",
          "update theme in dom",
        ],
      },

      init: {
        always: [
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
    },

    initial: "init",
  });

export const themeService = interpret(
  themeMachine
    .withConfig({
      guards: {
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
        "show dark theme": assign({ displayedTheme: (_) => "dark" }),
        "show light theme": assign({ displayedTheme: (_) => "light" }),
        "show system theme": assign({
          displayedTheme: (_, e) => e.value,
        }),
        "update theme in dom": (ctx) => {
          document.documentElement.dataset.theme = ctx.displayedTheme;
        },
        "clear local storage": () => {
          delete localStorage.theme;
        },
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
    .withContext({
      displayedTheme: getInitiallyDisplayedTheme(),
    })
).start();
