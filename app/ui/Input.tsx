import { cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "~/ui/cn";

const variants = cva(
  "flex h-10 w-full rounded-md border bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-50 dark:focus:ring-offset-gray-900",
  {
    variants: {
      validity: {
        valid:
          "border-gray-300 dark:border-gray-600 focus:ring-gray-400 dark:focus:ring-gray-400 ",
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
        aria-invalid={invalid}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
