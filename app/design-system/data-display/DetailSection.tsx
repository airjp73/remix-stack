import classNames from "classnames";
import type { FC, PropsWithChildren } from "react";
import { cloneElement } from "react";
import { mapChildrenSafe } from "../util/mapChildrenSafe";

type Variant = "default" | "compact";
type VariantStyles<T extends string> = { [key in T]: string };

export type DetailSectionProps = PropsWithChildren<{
  className?: string;
  variant?: Variant;
}>;

export type DetailSectionRowProps = PropsWithChildren<{
  label: string;
  variant?: Variant;
}>;

export type DetailSectionType = FC<DetailSectionProps> & {
  Row: FC<DetailSectionRowProps>;
};

const containerVariantStyles: VariantStyles<Variant> = {
  default: "px-4 py-5 sm:p-0",
  compact: "pt-2",
};

const dlVariantStyles: VariantStyles<Variant> = {
  default: "sm:divide-y sm-divide-gray-200",
  compact: "",
};

export const DetailSection: DetailSectionType = ({
  children,
  className,
  variant = "default",
}) => {
  return (
    <div
      className={classNames(
        "border-t border-gray-200",
        containerVariantStyles[variant],
        className
      )}
    >
      <dl className={dlVariantStyles[variant]}>
        {mapChildrenSafe(children, (child) =>
          cloneElement(child, {
            variant,
          })
        )}
      </dl>
    </div>
  );
};

const rowVariantStyles: VariantStyles<Variant> = {
  default: "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6",
  compact: "py-1 grid grid-cols-2 gap-4",
};

const ddVariantStyles: VariantStyles<Variant> = {
  default: "sm:col-span-2",
  compact: "",
};

const Row: DetailSectionType["Row"] = ({
  label,
  children,
  variant = "default",
}) => {
  return (
    <div className={rowVariantStyles[variant]}>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd
        className={classNames(
          "mt-1 text-sm text-gray-900 sm:mt-0",
          ddVariantStyles[variant]
        )}
      >
        {children}
      </dd>
    </div>
  );
};
DetailSection.Row = Row;
