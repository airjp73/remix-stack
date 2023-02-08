import { Snowflake, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ClientOnly } from "remix-utils";
import invariant from "tiny-invariant";
import { z } from "zod";
import { useTheme, useThemeSelector } from "./themeMachine";
import { Button } from "./ui/Button";
import { cn } from "./ui/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";

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

const AutoIcon = ({
  className,
  percentLight,
}: {
  className: string;
  percentLight: number;
}) => {
  return (
    <div className={cn("relative h-5 w-5", className)}>
      <Snowflake
        className="absolute inset-0 h-5 w-5 text-cyan-500"
        style={{
          clipPath: `polygon(${percentLight}% 0, 100% 0, 100% 100%, ${percentLight}% 100%)`,
          transition: "clip-path 1s ease-out",
        }}
      />
      <Sun
        className="absolute inset-0 h-5 w-5 text-amber-500"
        style={{
          clipPath: `polygon(0 0, ${percentLight}% 0, ${percentLight}% 100%, 0% 100%)`,
          transition: "clip-path 1s ease-out",
        }}
      />
    </div>
  );
};

const InternalThemeToggle = () => {
  const { t } = useTranslation();
  const [state, send] = useTheme();

  const buttonText = () => {
    if (state.matches("dark")) return t("theme.dark");
    if (state.matches("light")) return t("theme.light");
    return t("theme.auto");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <AutoIcon
            className="mr-2"
            percentLight={
              state.context.displayedTheme === "light"
                ? 100
                : state.matches("system")
                ? 50
                : 0
            }
          />
          <span className="w-12">{buttonText()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => send({ type: "choose light" })}>
          <Sun aria-hidden className="mr-2 h-5 w-5 text-amber-500" />
          <span>{t("theme.light")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => send({ type: "choose dark" })}>
          <Snowflake aria-hidden className="mr-2 h-5 w-5 text-cyan-500" />
          <span>{t("theme.dark")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => send({ type: "choose auto" })}>
          <AutoIcon aria-hidden className="mr-2" percentLight={50} />
          <span>{t("theme.auto")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const ThemeToggle = () => (
  <ClientOnly>{() => <InternalThemeToggle />}</ClientOnly>
);

export const ThemedHtmlElement = (
  props: React.ButtonHTMLAttributes<HTMLHtmlElement>
) => {
  const displayedTheme = useThemeSelector(
    (state) => state.context.displayedTheme
  );

  return <html {...props} data-theme={displayedTheme} />;
};

export const ThemeScript = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `
        // Ensure dark mode is always correctly set without a flash of light mode 
        if (localStorage.theme) {
          document.documentElement.dataset.theme = localStorage.theme;
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.dataset.theme = 'dark';
        } else {
          document.documentElement.dataset.theme = 'light';
        }
      `,
    }}
  />
);
