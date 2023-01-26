import { Switch } from "@headlessui/react";
import classNames from "classnames";
import type { FC } from "react";

export type ToggleProps = {
  label: string;
  subLabel?: string;
  className?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const Toggle: FC<ToggleProps> = ({
  label,
  subLabel,
  className,
  checked,
  onChange,
}) => {
  return (
    <Switch.Group
      as="div"
      className={classNames("flex items-center", className)}
    >
      <Switch
        checked={checked}
        onChange={onChange}
        className={classNames(
          checked ? "bg-brand-600" : "bg-gray-200",
          "focus:ring-brand-500 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            checked ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          )}
        />
      </Switch>
      <Switch.Label as="span" className="ml-3">
        <span className="text-sm font-medium text-gray-900">{label} </span>
        {subLabel && <span className="text-sm text-gray-500">{subLabel}</span>}
      </Switch.Label>
    </Switch.Group>
  );
};
