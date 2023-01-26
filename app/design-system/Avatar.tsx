import { UserIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import type { FC } from "react";

export type AvatarProps = {
  srOnlyLabel: string;
  className?: string;
  size?: string;
};

// TODO: support actual images
export const Avatar: FC<AvatarProps> = ({
  srOnlyLabel,
  className,
  size = "h-8 w-8",
}) => (
  <div
    className={classNames(
      "bg-brand-700 flex flex-shrink-0 items-center justify-center rounded-full",
      size,
      className
    )}
  >
    <span className="sr-only">{srOnlyLabel}</span>
    <UserIcon className="text-brand-100 h-2/3 w-2/3" />
  </div>
);
