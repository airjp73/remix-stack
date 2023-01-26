import classNames from "classnames";
import type { FC, ReactElement } from "react";
import { cloneElement } from "react";

export type EmptyStateProps = {
  title: string;
  subtitle: string;
  action: ReactElement;
  icon: ReactElement;
  className?: string;
};

export const EmptyState: FC<EmptyStateProps> = ({
  title,
  subtitle,
  action,
  icon,
  className,
}) => {
  return (
    <div className={classNames("text-center", className)}>
      {cloneElement(icon, { className: "mx-auto h-12 w-12 text-gray-400" })}
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      <div className="mt-6 flex items-center justify-center">{action}</div>
    </div>
  );
};
