import { type ReactNode } from "react";

export const SrText = ({ children }: { children: ReactNode }) => (
  <span className="sr-only">{children}</span>
);
