import type { FC } from "react";

export const HiddenInput: FC<
  Exclude<JSX.IntrinsicElements["input"], "hidden">
> = (props) => <input hidden readOnly {...props} />;
