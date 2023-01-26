import type { ReactElement, ReactNode } from "react";
import { Children, isValidElement } from "react";

export const mapChildrenSafe = (
  children: ReactNode | ReactNode[],
  fn: (child: ReactElement) => ReactElement
): ReactElement => {
  return Children.toArray(children)
    .filter(isValidElement)
    .map(fn) as unknown as ReactElement;
};
