import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { Link } from "@remix-run/react";
import { cva } from "class-variance-authority";
import { cn } from "./cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-gray-400 disabled:pointer-events-none dark:focus:ring-offset-gray-900 data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-800",
  {
    variants: {
      variant: {
        default: "bg-brand-500 text-white hover:bg-brand-700",
        google:
          "bg-white border border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-200 text-gray-700 font-semibold",
        outline:
          "bg-transparent border border-gray-200 hover:bg-gray-100 hover:bg-gray-700 dark:border-gray-700 dark:text-gray-100",
        subtle:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100",
        ghost:
          "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-100 dark:hover:text-gray-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent",
        link: "bg-transparent underline-offset-4 hover:underline text-gray-900 dark:text-gray-100 hover:bg-transparent dark:hover:bg-transparent",
        inherit: "",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        type="button"
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export interface ButtonLinkProps
  extends Omit<React.ComponentProps<typeof Link>, "to">,
    VariantProps<typeof buttonVariants> {
  href: string;
}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant, size, href, ...props }, ref) => {
    return (
      // In this case, we're relying on the consumer of this component to handle a11y
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      <Link
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        to={href}
        {...props}
      />
    );
  }
);
ButtonLink.displayName = "ButtonLink";

export { Button, ButtonLink, buttonVariants };
