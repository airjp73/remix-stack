import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import type { ComponentProps, FC, ReactElement } from "react";
import { cloneElement } from "react";
import { NavLink } from "react-router-dom";

export type SidebarProps = {
  className?: string;
  bottomContent?: ReactElement;
  logo: JSX.Element;
};

export type SidebarNavItemProps = {
  label: string;
  to: string;
  icon: ReactElement;
  count?: number;
  end?: boolean;
  className?: string;
};

export type SlideOutProps = {
  onClose: () => void;
  open: boolean;
  logo: JSX.Element;
};

export type SidebarType = FC<
  SidebarProps & ComponentProps<typeof motion.div>
> & {
  NavItem: FC<SidebarNavItemProps>;
  SlideOut: FC<SlideOutProps>;
};

export const Sidebar: SidebarType = ({
  children,
  bottomContent,
  className,
  logo,
  ...rest
}) => {
  return (
    <motion.div
      className={classNames(
        "flex min-h-0 flex-1 flex-col bg-gray-800",
        className
      )}
      {...rest}
    >
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div className="flex flex-shrink-0 items-center px-4">
          {cloneElement(logo, { className: "h-10 w-auto" })}
        </div>
        <nav
          className="mt-5 flex-1 space-y-1 bg-gray-800 px-2"
          aria-label="Sidebar"
        >
          {children}
        </nav>
      </div>
      {bottomContent}
    </motion.div>
  );
};

const NavItem: SidebarType["NavItem"] = ({
  label,
  to,
  icon,
  count,
  end,
  className,
}) => (
  <NavLink
    to={to}
    end={end}
    className={classNames(
      "navItem", // need to drop down to css to get children to be styled correctly when active
      "group flex items-center rounded-md px-2 py-2 text-sm font-medium",
      className
    )}
  >
    {cloneElement(icon, {
      className: "navItemIcon mr-3 flex-shrink-0 h-6 w-6",
      "aria-hidden": "true",
    })}
    <span className="flex-1">{label}</span>
    {!!count && (
      <span
        className={
          "navItemCount ml-3 inline-block rounded-full py-0.5 px-3 text-xs font-medium"
        }
      >
        {count}
      </span>
    )}
  </NavLink>
);
Sidebar.NavItem = NavItem;

const SlideOut: SidebarType["SlideOut"] = ({
  children,
  open,
  onClose,
  logo,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          static
          as={motion.div}
          className="fixed inset-0 z-40 flex md:hidden"
          onClose={onClose}
          open
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          <Dialog.Overlay
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "linear", duration: 0.3 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
          />
          <Sidebar
            className="relative"
            initial={{ translateX: "-100%" }}
            animate={{ translateX: "0%" }}
            exit={{ translateX: "-100%" }}
            transition={{ type: "linear", duration: 0.3 }}
            logo={logo}
          >
            <motion.div
              className="absolute top-0 right-0 -mr-12 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "linear", duration: 0.3 }}
            >
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={onClose}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </motion.div>
            {children}
          </Sidebar>
          <div className="w-14 flex-shrink-0" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
Sidebar.SlideOut = SlideOut;
