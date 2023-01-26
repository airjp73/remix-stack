import classNames from "classnames";
import type { ComponentProps, FC, ReactElement } from "react";
import { cloneElement, forwardRef } from "react";
import { Link } from "./internal/Link";
import { Spinner } from "./Spinner";

const buttonBase = classNames(
  "flex",
  "justify-center",
  "items-center",
  "transform",
  "py-2",
  "px-4",
  "rounded-md",
  "text-sm",
  "font-medium",
  "whitespace-nowrap",
  "disabled:bg-gray-400",
  "disabled:text-gray-600",
  "disabled:shadow-none",
  "disabled:cursor-default",
  "disabled:transform-none",

  "focus:outline-none",
  "focus:shadow-md",
  "focus-visible:ring-2",
  "focus-visible:ring-offset-2",
  "active:shadow-inner",
  "hover:shadow-md",
  "border",
  "disabled:border-transparent"
);

const buttonPrimary = classNames(
  "bg-brand-600",
  "border-transparent",
  "text-white",
  "shadow-sm",
  "active:bg-brand-600",
  "hover:bg-brand-500",
  "focus-visible:ring-brand-500"
);

const buttonSecondary = classNames(
  "text-brand-700",
  "bg-brand-100",
  "border-brand-200",
  "hover:bg-brand-200",
  "focus-visible:ring-brand-500",
  "active:border-brand-500",
  "active:bg-brand-300"
);

const buttonTertiary = classNames(
  "border",
  "border-gray-300",
  "text-gray-700",
  "bg-white",
  "hover:bg-gray-50",
  "active:border-gray-700",
  "focus-visible:ring-brand-500"
);

const buttonDestructivePrimary = classNames(
  "bg-destructive-500 ",
  "text-white",
  "shadow-sm",
  "active:bg-destructive-600",
  "focus-visible:ring-destructive-500",
  "hover:bg-destructive-400",
  "border-transparent"
);

const buttonDestructiveSecondary = classNames(
  "bg-destructive-100 ",
  "text-destructive-700",
  "shadow-sm",
  "hover:bg-destructive-200",
  "focus-visible:ring-destructive-500",
  "active:border-destructive-400",
  "border-destructive-200",
  "active:bg-destructive-300"
);

const variantStyles = {
  primary: buttonPrimary,
  secondary: buttonSecondary,
  tertiary: buttonTertiary,
  destructivePrimary: buttonDestructivePrimary,
  destructiveSecondary: buttonDestructiveSecondary,
  custom: "",
} as const;

const buttonStyles = (
  variant: keyof typeof variantStyles,
  className?: string
) => classNames(buttonBase, variantStyles[variant], className);

export type BaseButtonProps = {
  label: string;
  variant?: keyof typeof variantStyles;
  icon?: ReactElement;
  rightIcon?: ReactElement;
};

export type ButtonProps = BaseButtonProps &
  Omit<JSX.IntrinsicElements["button"], "ref">;
export type ButtonLinkProps = BaseButtonProps & ComponentProps<typeof Link>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      disabled,
      label,
      icon,
      rightIcon,
      type = "button",
      ...rest
    },
    ref
  ) => (
    <button
      className={buttonStyles(variant, className)}
      type={type}
      disabled={disabled}
      ref={ref}
      {...rest}
    >
      {icon && cloneElement(icon, { className: "h-4 w-4 mr-2" })}
      {label}
      {rightIcon && cloneElement(rightIcon, { className: "h-4 w-4 ml-2" })}
    </button>
  )
);
Button.displayName = "Button";

export const ButtonLink: FC<ButtonLinkProps> = ({
  className,
  variant = "primary",
  label,
  icon,
  rightIcon,
  ...rest
}) => (
  <Link className={buttonStyles(variant, className)} {...rest}>
    {icon && cloneElement(icon, { className: "h-4 w-4 mr-2" })}
    {label}
    {rightIcon && cloneElement(rightIcon, { className: "h-4 w-4 ml-2" })}
  </Link>
);

export type LoadableButtonProps = {
  loadingLabel: string;
  isLoading?: boolean;
};

export const LoadableButton = ({
  loadingLabel,
  isLoading,
  disabled,
  label,
  ...rest
}: LoadableButtonProps & ButtonProps) => {
  return (
    <Button
      disabled={disabled || isLoading}
      label={isLoading ? loadingLabel : label}
      icon={isLoading ? <Spinner className="text-gray-700" /> : undefined}
      {...rest}
    />
  );
};

export const LoadableButtonLink = ({
  loadingLabel,
  isLoading,
  label,
  ...rest
}: LoadableButtonProps & ButtonLinkProps) => {
  return (
    <ButtonLink
      label={isLoading ? loadingLabel : label}
      icon={isLoading ? <Spinner className="text-gray-700" /> : undefined}
      {...rest}
    />
  );
};
