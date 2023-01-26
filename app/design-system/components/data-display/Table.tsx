import classNames from "classnames";
import type { FC, PropsWithChildren } from "react";

export type TableProps = PropsWithChildren<{
  className?: string;
}>;

export type TableCellProps = {
  primaryColumn?: boolean;
} & JSX.IntrinsicElements["td"];

export type ActionHeaderCellProps = {
  className?: string;
  srOnlyLabel: string;
};

export type TableType = FC<TableProps> & {
  Header: FC<PropsWithChildren>;
  Body: FC<JSX.IntrinsicElements["tbody"]>;
  Row: FC<JSX.IntrinsicElements["tr"]>;
  HeaderCell: FC<JSX.IntrinsicElements["th"]>;
  ActionHeaderCell: FC<ActionHeaderCellProps>;
  Cell: FC<TableCellProps>;
};

export const Table: TableType = ({ children, className }) => {
  return (
    <div className={classNames("flex flex-col", className)}>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              {children}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

Table.Header = ({ children }) => (
  <thead className="bg-gray-50">
    <tr>{children}</tr>
  </thead>
);
Table.Header.displayName = "Table.Header";

Table.Body = ({ className, ...rest }) => (
  <tbody
    className={classNames("divide-y divide-gray-200 bg-white", className)}
    {...rest}
  />
);
Table.Body.displayName = "Body";

Table.HeaderCell = ({ className, ...rest }) => (
  <th
    scope="col"
    className={classNames(
      "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500",
      className
    )}
    {...rest}
  />
);
Table.HeaderCell.displayName = "HeaderCell";

Table.ActionHeaderCell = ({ className, srOnlyLabel }) => (
  <th scope="col" className={classNames("relative px-6 py-3", className)}>
    <span className="sr-only">{srOnlyLabel}</span>
  </th>
);
Table.ActionHeaderCell.displayName = "ActionHeaderCell";

Table.Row = (props) => <tr {...props} />;
Table.Row.displayName = "Row";

Table.Cell = ({ children, primaryColumn, className }) => (
  <td
    className={classNames(
      "whitespace-nowrap px-6 py-4 text-sm font-medium",
      primaryColumn ? "text-gray-900" : "text-gray-500",
      className
    )}
  >
    {children}
  </td>
);
Table.Cell.displayName = "Cell";
