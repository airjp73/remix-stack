import classNames from "classnames";
import type { FC, ReactNode } from "react";

export type SectionTitleProps = {
  title: string;
  subtitle?: string;
  className?: string;
  action?: ReactNode;
};

export const SectionTitle: FC<SectionTitleProps> = ({
  title,
  subtitle,
  className,
  action,
}) => {
  const titles = (
    <>
      <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </>
  );

  if (action)
    return (
      <div
        className={classNames("flex items-center justify-between", className)}
      >
        <div>{titles}</div>
        {action}
      </div>
    );

  return <div className={className}>{titles}</div>;
};
