import classNames from "classnames";
import type { FC } from "react";

export type ContentContainerProps = {
  className?: string;
};

export const ContentContainer: FC<ContentContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={classNames(
        "mx-auto max-w-3xl px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
};
