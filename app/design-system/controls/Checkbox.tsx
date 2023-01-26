import classNames from "classnames";
import type { FC } from "react";

export type CheckboxProps = {
  label: string;
  name: string;
  className?: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Checkbox: FC<CheckboxProps> = ({
  label,
  name,
  className,
  checked,
  onChange,
}) => {
  return (
    <div className={classNames("relative flex items-start", className)}>
      <div className="flex h-5 items-center">
        <input
          id={name}
          aria-describedby="comments-description"
          name={name}
          type="checkbox"
          className="text-brand-600 focus:ring-brand-500 h-4 w-4 rounded border-gray-300"
          checked={checked}
          onChange={onChange}
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={name} className="font-medium text-gray-700">
          {label}
        </label>
      </div>
    </div>
  );
};
