import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { ClientOnly } from "./ClientOnly";

type PortalProps = { children: ReactNode };

// Headless UI's portal doesn't work after naviation for some reason
const PortalInner = ({ children }: PortalProps) =>
  createPortal(children, document.body);

export const Portal = ({ children }: PortalProps) => (
  <ClientOnly>{() => <PortalInner>{children}</PortalInner>}</ClientOnly>
);
