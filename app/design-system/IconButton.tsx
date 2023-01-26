import classNames from "classnames";
import type { FC } from "react";

const variantStyles = {
  faded: "text-gray-300",
  highlighted: "bg-brand-500 text-white",
  default: "text-gray-500",
  clockFace: "text-gray-600",
};

const variantHoverStyles = {
  highlighted: "focus-visible:bg-brand-400 hover:bg-brand-400",
  default: "focus-visible:bg-gray-200 hover:bg-gray-200",
  faded: "focus-visible:bg-gray-200 hover:bg-gray-200",
  clockFace:
    "focus-visible:bg-brand-400 focus-visible:text-white hover:bg-brand-400 hover:text-white",
};

export type IconButtonProps = {
  variant?: keyof typeof variantStyles;
} & JSX.IntrinsicElements["button"];

export const IconButton: FC<IconButtonProps> = ({
  className,
  disabled,
  variant = "default",
  ...rest
}) => {
  return (
    <button
      className={classNames(
        "ring-brand-500 rounded-full text-center",
        disabled ? "cursor-default" : variantHoverStyles[variant],
        variantStyles[variant],
        className
      )}
      type="button"
      disabled={disabled}
      {...rest}
    />
  );
};
