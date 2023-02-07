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
  /** @xstate-layout N4IgpgJg5mDOIC5QBcAWYC2YB0sCesymAxAMaoD2FsYABBAIYBOA1gNoAMAuoqAA7UAlskEUAdrxAAPRAHYOATmwAOZQCZlAFgBsHAKx7t85QBoQeRJr3LsswwEYFWx8vtqAzAF9PZtJhz4hCTkVDS0ADaCUKjInDxIIAKwwqISCTII8kqqGjr6hsZmFgjuerK2hmqKju5qstrK3r7oWLgERBjEgR20fli05AxiMBBxkkkp4pIZmjrYtRzu7soKDQocHKbmiI5KCvsKmvayCrL2em5qTSB9OIysZJTUdJHRsdzjQiJT6Tv27kp6oZFO4OPZFtoFEVEBdtLZ7FZNK5tB4rNdbth7ixHqE6AwAK7IChjBITb5pUAZLLYVaKXTKPQ6M6yaEITSbbBqSrubQo2SqZTaPTolo4V4xHHPejMdgfUlfVLTP4A2xC3QKUHgnlQ7YIAqchF6RQKRlqBrCnw3UXYcXISVhAlEkn8BU-SnK7KadyyNRHDaLWQs3UecobbSORl2U6bbQi-zYQRiYTEZ2JV0U6Q7LnYTQHWnHOqCvSs6z2CrhpGKQMXC3NeOJ5NsezxF3JclKhBuPQ5vO6Av8oWs1w9-Yoo1WcEKOOtBt2thqFtptuK36d7O5g59n0D4u6nmabBlDQAgGnIVea5iCgQOCSW6fZduzMIAC02lZb+w-v0dQ29nOigMtOATtJgD6TBmMznDSejuP8pa+vYKysrUNjsiixxaAoCLIsBmIyuB7arsoPrzOs2gbmamhqI4rK5nC-z-qUJquFosh4bahEru6na1GonKyO4sx6PscG1HRkIqK4-z6OaHC8rWVr1kmyBcU+MxqChKIqGoajrEJAL-FUsbeJ4QA */
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

        entry: [
          "clear local storage",
          "set display theme from system",
          "update theme in dom",
        ],

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
        "set display theme from system": assign({
          displayedTheme: (ctx) =>
            window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light",
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
