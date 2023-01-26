import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import type { FC, ReactElement } from "react";

export type TextareaProps = {
  label: string;
  name: string;
  optional?: boolean;
  className?: string;
  error?: string;
  renderRightButton?: (stuff: {
    buttonProps: { className: string; type: "button" };
  }) => ReactElement;
};

export const Textarea: FC<
  TextareaProps & JSX.IntrinsicElements["textarea"]
> = ({
  label,
  name,
  optional,
  className,
  renderRightButton,
  error,
  ...rest
}) => {
  return (
    <div className={className}>
      <div className="flex justify-between">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        {optional && <span className="text-sm text-gray-500">Optional</span>}
      </div>
      <div className="relative mt-1 flex rounded-md shadow-sm">
        <textarea
          name={name}
          id={name}
          className={classNames(
            "focus:border-brand-500 focus:ring-brand-500 block w-full border-gray-300 pr-10 focus:z-10 sm:text-sm",
            renderRightButton ? "rounded-l-md" : "rounded-md",
            error &&
              "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500"
          )}
          {...rest}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
        {renderRightButton?.({
          buttonProps: {
            type: "button",
            className: classNames(
              "-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm",
              "font-medium rounded-r-md text-gray-700 bg-gray-50",
              "hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            ),
          },
        })}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {error}
        </p>
      )}
    </div>
  );
};
