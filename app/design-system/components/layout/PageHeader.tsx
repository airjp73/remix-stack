import classNames from "classnames";
import type { FC, ReactNode } from "react";

export type PageHeaderProps = {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  leftActions?: ReactNode;
  className?: string;
};

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  leftActions,
  actions,
  subtitle,
  className,
}) => {
  return (
    <div
      className={classNames(
        "md:flex md:items-center md:justify-between",
        className
      )}
    >
      {leftActions && <div className="mr-4 flex space-x-2">{leftActions}</div>}
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
          {title}
        </h2>
        {typeof subtitle === "string" ? (
          <h3 className="mt-4 text-xl text-gray-800">{subtitle}</h3>
        ) : (
          subtitle
        )}
      </div>
      {actions && <div className="mt-4 flex md:mt-0 md:ml-4">{actions}</div>}
    </div>
  );
};
