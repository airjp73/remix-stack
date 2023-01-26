import classNames from "classnames";
import type { ReactNode } from "react";
import { cloneElement } from "react";
import { Modal } from "./Modal";

type ConfirmationModalBodyProps = {
  icon: JSX.Element;
  iconCircleClassName: string;
  title: string;
  explanation: ReactNode;
  className?: string;
  children?: ReactNode;
};

export const ConfirmationModalBody = ({
  icon,
  className,
  title,
  explanation,
  iconCircleClassName,
}: ConfirmationModalBodyProps) => (
  <div className={classNames("sm:flex sm:items-start", className)}>
    <div
      className={classNames(
        "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10",
        iconCircleClassName
      )}
    >
      {cloneElement(icon, {
        className: classNames("w-6 h-6", icon.props.className),
        "aria-hidden": "true",
      })}
    </div>
    <div className="mt-3 flex-1 text-center sm:mt-0 sm:ml-4 sm:text-left">
      <Modal.Title className="text-lg font-medium leading-6 text-gray-900">
        {title}
      </Modal.Title>
      <div className="mt-2">
        {typeof explanation === "string" ? (
          <p className="text-sm text-gray-500">{explanation}</p>
        ) : (
          explanation
        )}
      </div>
    </div>
  </div>
);
