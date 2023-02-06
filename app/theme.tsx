import { useActor } from "@xstate/react";
import { useId } from "react";
import { ClientOnly } from "remix-utils";
import invariant from "tiny-invariant";
import { z } from "zod";
import { themeService } from "./theme.client";
import { Switch } from "./ui/Switch";

const storageSchema = z.object({
  theme: z.enum(["light", "dark"]),
});

export type Theme = z.infer<typeof storageSchema>["theme"];

export const getInitialThemeInfo = (): {
  displayed: Theme;
  state: Theme | "system";
} => {
  invariant(
    localStorage,
    "Can only access the theme on the client. Consider wrapping the component in a `ClientOnly`."
  );

  try {
    const { theme } = storageSchema.parse(localStorage);
    return { displayed: theme, state: theme };
  } catch (err) {
    return {
      displayed: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
      state: "system",
    };
  }
};

const ThemeToggleInternal = () => {
  const descriptionId = useId();
  const [state, send] = useActor(themeService);

  return (
    <div className="flex items-center space-x-2">
      <Switch
        aria-label="Toggle theme"
        aria-describedby={descriptionId}
        onClick={() => {
          const nextTheme =
            state.context.displayedTheme === "light" ? "dark" : "light";
          send({ type: nextTheme === "dark" ? "choose dark" : "choose light" });
        }}
        checked={state.context.displayedTheme === "dark"}
      />
      <p id={descriptionId} className="text-gray-900 dark:text-gray-100">
        {state.context.displayedTheme === "dark" ? "Dark" : "Light"}
      </p>
    </div>
  );
};

export const ThemeToggle = () => (
  <ClientOnly>{() => <ThemeToggleInternal />}</ClientOnly>
);
