import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import type { FC } from "react";
import { Link } from "react-router-dom";

export type CrumbProps = {
  to: string;
  current?: boolean;
  root?: boolean;
};

export type BreadcrumbsProps = {
  className?: string;
};

export type BreadcrumbsType = FC<BreadcrumbsProps> & {
  Crumb: FC<CrumbProps>;
};

export const Breadcrumbs: BreadcrumbsType = ({ children, className }) => {
  return (
    <nav className={classNames("flex", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        <Breadcrumbs.Crumb to="/teacher" root>
          <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span className="sr-only">Home</span>
        </Breadcrumbs.Crumb>
        {children}
      </ol>
    </nav>
  );
};

const Crumb: BreadcrumbsType["Crumb"] = ({ to, children, current, root }) => (
  <li>
    <div className="flex items-center">
      {!root && (
        <ChevronRightIcon
          className="h-5 w-5 flex-shrink-0 text-gray-400"
          aria-hidden="true"
        />
      )}
      <Link
        data-breadcrumb
        to={to}
        className={classNames(
          !root && "ml-4",
          "text-sm font-medium text-gray-500 hover:text-gray-700"
        )}
      >
        {children}
      </Link>
    </div>
  </li>
);
Breadcrumbs.Crumb = Crumb;
