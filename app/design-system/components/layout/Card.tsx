import classNames from "classnames";
import type { FC, PropsWithChildren } from "react";

export type CardProps = {
  className?: string;
};

export type CardType = FC<PropsWithChildren<CardProps>> & {
  Content: FC<PropsWithChildren<{ className?: string }>>;
};

export const Card: CardType = ({ children, className }) => {
  return (
    <div
      data-card
      className={classNames(
        "overflow-hidden rounded-lg bg-white shadow",
        className
      )}
    >
      {children}
    </div>
  );
};

const Content: CardType["Content"] = ({ children, className }) => (
  <div className={classNames("px-4 py-5 sm:p-6", className)}>{children}</div>
);
Card.Content = Content;
