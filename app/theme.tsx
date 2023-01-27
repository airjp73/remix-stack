import { useId, useState } from "react";
import { ClientOnly } from "remix-utils";
import invariant from "tiny-invariant";
import { z } from "zod";
import { Switch } from "./ui/Switch";

const storageSchema = z.object({
  theme: z.enum(["light", "dark"]),
});

export type Theme = z.infer<typeof storageSchema>["theme"];

export const updateTheme = (theme: Theme) => {
  window.localStorage.theme = theme;

  if (theme === "dark") {
    document.documentElement.dataset.theme = "dark";
  } else {
    document.documentElement.dataset.theme = "light";
  }
};

export const getCurrentTheme = (): Theme => {
  invariant(
    localStorage,
    "Can only access the theme on the client. Consider wrapping the component in a `ClientOnly`."
  );
  try {
    const { theme } = storageSchema.parse(localStorage);
    return theme;
  } catch (err) {
    console.log("Invalid theme, defaulting to light mode");
    localStorage.theme = "light";
    return "light";
  }
};

const ThemeToggleInternal = () => {
  const [theme, setTheme] = useState<Theme>(getCurrentTheme());
  const descriptionId = useId();
  return (
    <div className="flex items-center space-x-2">
      <Switch
        aria-label="Toggle theme"
        aria-describedby={descriptionId}
        onClick={() => {
          const nextTheme = theme === "light" ? "dark" : "light";
          updateTheme(nextTheme);
          setTheme(nextTheme);
        }}
        checked={theme === "dark"}
      />
      <p id={descriptionId} className="text-slate-900 dark:text-slate-100">
        {theme === "dark" ? "Dark" : "Light"}
      </p>
    </div>
  );
};

export const ThemeToggle = () => (
  <ClientOnly>{() => <ThemeToggleInternal />}</ClientOnly>
);
