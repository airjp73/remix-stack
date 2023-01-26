import { RadioGroup as BaseRadioGroup } from "@headlessui/react";
import classNames from "classnames";
import type { FC, PropsWithChildren } from "react";
import { useState } from "react";
import { Children, cloneElement, isValidElement } from "react";

export type RadioGroupProps = PropsWithChildren<{
  srOnlyLabel: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  className?: string;
  name: string;
  defaultValue?: string;
}>;

export type RadioGroupType = FC<RadioGroupProps> & {
  Option: FC<{
    value: string;
    label: string;
    description?: string;
    className?: string;
    name?: string;
  }>;
};

export const RadioGroup: RadioGroupType = ({
  children,
  srOnlyLabel,
  value,
  onChange,
  className,
  name,
  defaultValue,
}) => {
  const validChildren = Children.toArray(children).filter(isValidElement);
  const [internalValue, setInternalValue] = useState(value ?? defaultValue);

  return (
    <BaseRadioGroup
      value={value ?? internalValue}
      onChange={(nextVal) => {
        if (onChange) onChange(nextVal);
        else setInternalValue(nextVal);
      }}
      className={className}
    >
      <BaseRadioGroup.Label className="sr-only">
        {srOnlyLabel}
      </BaseRadioGroup.Label>
      <div className="-space-y-px rounded-md bg-white">
        {validChildren.map((child, index) =>
          cloneElement(child, {
            className: classNames(
              index === 0 ? "rounded-tl-md rounded-tr-md" : "",
              index === validChildren.length - 1
                ? "rounded-bl-md rounded-br-md"
                : "",
              (child.props as any).className
            ),
            name,
          } as any)
        )}
      </div>
    </BaseRadioGroup>
  );
};

const Option: RadioGroupType["Option"] = ({
  className,
  value,
  label,
  description,
  name,
}) => (
  <BaseRadioGroup.Option
    value={value}
    className={({ checked }) =>
      classNames(
        className,
        checked ? "border-brand-200 bg-brand-50 z-10" : "border-gray-200",
        "relative flex cursor-pointer border p-4 focus:outline-none"
      )
    }
  >
    {({ active, checked }) => (
      <>
        <span
          className={classNames(
            checked
              ? "bg-brand-600 border-transparent"
              : "border-gray-300 bg-white",
            active ? "ring-brand-500 ring-2 ring-offset-2" : "",
            "mt-0.5 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border"
          )}
          aria-hidden="true"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        </span>
        <div className="ml-3 flex flex-col">
          <BaseRadioGroup.Label
            as="span"
            className={classNames(
              checked ? "text-brand-900" : "text-gray-900",
              "block text-sm font-medium"
            )}
          >
            {label}
            <input
              type="radio"
              className="hidden"
              name={name}
              value={value}
              checked={checked}
              readOnly
            />
          </BaseRadioGroup.Label>
          {description && (
            <BaseRadioGroup.Description
              as="span"
              className={classNames(
                checked ? "text-brand-700" : "text-gray-500",
                "block text-sm"
              )}
            >
              {description}
            </BaseRadioGroup.Description>
          )}
        </div>
      </>
    )}
  </BaseRadioGroup.Option>
);
RadioGroup.Option = Option;
