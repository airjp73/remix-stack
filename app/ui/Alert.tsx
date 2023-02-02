import { Info, XCircle, CheckCircle, X } from "lucide-react";
import { FC, ReactNode, useState } from "react";
import { Button } from "./Button";
import { cn } from "./cn";

export type AlertVariants = "error" | "info" | "success";

export type AlertProps = {
  title?: string;
  details?: ReactNode;
  className?: string;
  variant: AlertVariants;
  action?: ReactNode;
};

const variantIcons = {
  error: XCircle,
  info: Info,
  success: CheckCircle,
};

export const Alert: FC<AlertProps> = ({
  title,
  details,
  className,
  variant,
  action,
}) => {
  const Icon = variantIcons[variant];
  const cssVars = {
    "--hover-color": "theme(colors.green.500)", // theme?.colors?.green?.[500],
  };

  return (
    <div
      role="alert"
      className={cn(
        "rounded-md border border-red-400 p-4",
        variant === "error" &&
          "dark:bg-border-red-200 border-red-400 bg-red-50 dark:bg-red-900",
        variant === "info" &&
          "dark:bg-border-blue-200 border-blue-400 bg-blue-50 dark:bg-blue-900",
        variant === "success" &&
          "dark:bg-border-green-200 border-green-400 bg-green-50 dark:bg-green-900",
        className
      )}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon
            className={cn(
              "h-5 w-5",
              variant === "error" && "text-red-500 dark:text-red-400",
              variant === "info" && "text-blue-500 dark:text-blue-400",
              variant === "success" && "text-green-500 dark:text-green-400"
            )}
          />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3
              className={cn(
                "text-sm font-medium",
                variant === "error" && "text-red-800 dark:text-red-200",
                variant === "info" && "text-blue-800 dark:text-blue-200",
                variant === "success" && "text-green-800 dark:text-green-200"
              )}
            >
              {title}
            </h3>
          )}
          {details && (
            <div
              className={cn(
                "text-sm",
                !!title && "mt-2",
                variant === "error" && "text-red-700 dark:text-red-300",
                variant === "info" && "text-blue-700 dark:text-blue-300",
                variant === "success" && "text-green-700 dark:text-green-300"
              )}
            >
              {details}
            </div>
          )}
        </div>
        {action && (
          <div
            className={cn(
              "flex-shrink-0",
              variant === "error" && "text-red-700 dark:text-red-300",
              variant === "info" && "text-blue-700 dark:text-blue-300",
              variant === "success" && "text-green-700 dark:text-green-300"
            )}
            style={cssVars as any}
          >
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export const DismissibleAlert = ({
  variant,
  ...rest
}: Omit<AlertProps, "action">) => {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <Alert
      variant={variant}
      {...rest}
      action={
        <Button
          size="sm"
          className={cn(
            variant === "error" &&
              "text-red-700 hover:bg-red-200 focus:ring-red-500 dark:text-red-300 dark:hover:bg-red-800 dark:focus:ring-red-300 dark:focus:ring-offset-red-700",
            variant === "info" &&
              "text-blue-700 hover:bg-blue-200 focus:ring-blue-500 dark:text-blue-300 dark:hover:bg-blue-800 dark:focus:ring-blue-300 dark:focus:ring-offset-blue-700",
            variant === "success" &&
              "text-green-700 hover:bg-green-200 focus:ring-green-500 dark:text-green-300 dark:hover:bg-green-800 dark:focus:ring-green-300 dark:focus:ring-offset-green-700"
          )}
          variant="inherit"
          onClick={() => setDismissed(true)}
        >
          <X />
        </Button>
      }
    />
  );
};
