import { cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "~/ui/cn";

const variants = cva(
  "flex h-10 w-full rounded-md border bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-50 dark:focus:ring-offset-slate-900",
  {
    variants: {
      validity: {
        valid:
          "border-slate-300 dark:border-slate-600 focus:ring-slate-400 dark:focus:ring-slate-400 ",
        invalid:
          "border-red-300 dark:border-red-700 focus:ring-red-400 dark:focus:ring-red-400",
      },
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <input
        className={cn(
          variants({
            className: className,
            validity: invalid ? "invalid" : "valid",
          })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
