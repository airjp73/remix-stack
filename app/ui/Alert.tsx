import { Info, XCircle } from "lucide-react";
import classNames from "classnames";
import type { FC, ReactNode } from "react";

export type AlertVariants = "error" | "info";

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
      className={classNames(
        "rounded-md border border-red-400 p-4",
        variant === "error" && "border-red-400 bg-red-50",
        variant === "info" && "border-blue-400 bg-blue-50",
        className
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon
            className={classNames(
              "h-5 w-5",
              variant === "error" && "text-red-500",
              variant === "info" && "text-blue-500"
            )}
          />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3
              className={classNames(
                "text-sm font-medium",
                variant === "error" && "text-red-800",
                variant === "info" && "text-blue-800"
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
                variant === "error" && "text-red-700",
                variant === "info" && "text-blue-700"
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
