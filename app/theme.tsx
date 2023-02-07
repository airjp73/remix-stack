import { useActor } from "@xstate/react";
import { Moon, Snowflake, Sun } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { ClientOnly } from "remix-utils";
import invariant from "tiny-invariant";
import { z } from "zod";
import { themeService } from "./theme.client";
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

const ThemeToggleInternal = () => {
  const [state, send] = useActor(themeService);

  const buttonText = () => {
    // TODO: framer-motion tweak?
    if (state.matches("dark")) return <span>Dark</span>;

    if (state.matches("light")) {
      return <span>Light</span>;
    }

    return <span>Auto</span>;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
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
          {buttonText()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => send({ type: "choose light" })}>
          <Sun className="mr-2 h-5 w-5 text-amber-500" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => send({ type: "choose dark" })}>
          <Snowflake className="mr-2 h-5 w-5 text-cyan-500" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => send({ type: "choose auto" })}>
          <AutoIcon className="mr-2" percentLight={50} />
          <span>Auto</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const ThemeToggle = () => (
  <ClientOnly>{() => <ThemeToggleInternal />}</ClientOnly>
);
