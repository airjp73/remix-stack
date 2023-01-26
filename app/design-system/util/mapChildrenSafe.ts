import type { ReactElement, ReactNode } from "react";
import { Children, isValidElement } from "react";

export const mapChildrenSafe = (
  children: ReactNode | ReactNode[],
  fn: (child: ReactElement<any>) => ReactElement<any>
) => {
  return Children.toArray(children).filter(isValidElement).map(fn);
};
