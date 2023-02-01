import { Info, XCircle, CheckCircle } from "lucide-react";
import classNames from "classnames";
import type { FC, ReactNode } from "react";

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

  return (
    <div
      role="alert"
      className={classNames(
        "rounded-md border border-red-400 p-4",
        variant === "error" &&
          "dark:bg-border-red-200 border-red-400 bg-red-50 dark:bg-red-900",
        variant === "info" &&
          "dark:bg-border-blue-200 dar:bg-blue-900 border-blue-400 bg-blue-50",
        variant === "success" &&
          "dark:bg-border-green-200 border-green-400 bg-green-50 dark:bg-green-900",
        className
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon
            className={classNames(
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
              className={classNames(
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
              className={classNames(
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
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
};
