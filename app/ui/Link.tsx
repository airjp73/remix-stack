import { Link as RemixLink } from "@remix-run/react";
import { PropsWithChildren } from "react";
import { cn } from "./cn";

export type LinkProps = PropsWithChildren<{ href: string; className?: string }>;
export const Link = ({ href, children, className }: LinkProps) => {
  return (
    <RemixLink
      to={href}
      className={cn(
        "font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-500",
        className
      )}
    >
      {children}
    </RemixLink>
  );
};
