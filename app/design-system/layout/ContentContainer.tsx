import classNames from "classnames";
import type { PropsWithChildren } from "react";

export type ContentContainerProps = {
  className?: string;
};

export const ContentContainer = ({
  children,
  className,
}: PropsWithChildren<ContentContainerProps>) => {
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
