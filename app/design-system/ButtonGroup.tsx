import classNames from "classnames";
import type { FC, PropsWithChildren } from "react";
import { cloneElement } from "react";
import { mapChildrenSafe } from "./util/mapChildrenSafe";

export type ButtonGroupType = FC<
  PropsWithChildren<{
    onChange: (value: string) => void;
    value: string;
    vertical?: boolean;
    className?: string;
  }>
> & {
  Button: FC<
    PropsWithChildren<{
      selectedValue?: string;
      onClick?: (value: string) => void;
      value: string;
      className?: string;
    }>
  >;
};

export const ButtonGroup: ButtonGroupType = ({
  className,
  children,
  onChange,
  value,
  vertical,
}) => {
  return (
    <div
      className={classNames(
        "overflow-hidden rounded border border-gray-200 bg-gray-200",
        vertical ? "flex flex-col space-y-px" : "space-x-px",
        className
      )}
      onChange={(event) => {
        onChange((event.target as HTMLInputElement).value);
      }}
    >
      {mapChildrenSafe(children, (child) =>
        cloneElement(child, {
          selectedValue: value,
          onClick: onChange,
        })
      )}
    </div>
  );
};

const Button: ButtonGroupType["Button"] = ({
  className,
  children,
  value,
  selectedValue,
  onClick,
}) => {
  return (
    <button
      className={classNames(
        "py-2 px-4 text-sm text-gray-800",
        selectedValue !== value && "bg-white",
        "focus-visible:bg-brand-100",
        className
      )}
      onClick={() => onClick?.(value)}
      type="button"
    >
      {children}
    </button>
  );
};
ButtonGroup.Button = Button;
