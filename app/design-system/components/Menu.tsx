import { Menu as HeadlessMenu } from "@headlessui/react";
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/20/solid";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import type { FC, PropsWithChildren, ReactNode } from "react";
import { cloneElement, useState } from "react";
import { usePopper } from "react-popper";
import { mapChildrenSafe } from "../util/mapChildrenSafe";
import { Link } from "./internal/Link";
import { Portal } from "./internal/Portal";

const itemActiveStyles = {
  default: "bg-gray-100",
  destructive: "bg-red-100",
};

const itemBaseStyles = {
  default: "text-gray-700",
  destructive: "text-red-600",
};

export type MenuItemProps = {
  label: string;
  className?: string;
  variant?: "default" | "destructive";
};

export type MenuItemButtonProps = MenuItemProps & {
  onClick: () => void;
};

export type MenuItemLinkProps = MenuItemProps & {
  to: string;
  rawLink?: boolean;
};

export type MenuChildProps = {
  open?: boolean;
  setShowMoreElement?: (element: HTMLElement | null) => void;
  setPopupElement?: (element: HTMLElement | null) => void;
  popper?: ReturnType<typeof usePopper>;
};

export type MenuType = FC<{ children?: ReactNode }> & {
  ItemButton: FC<MenuItemButtonProps>;
  ItemLink: FC<MenuItemLinkProps>;
  Button: FC<PropsWithChildren<MenuChildProps>>;
  RawButton: typeof HeadlessMenu.Button;
  Section: FC<PropsWithChildren>;
  Items: FC<PropsWithChildren<MenuChildProps>>;
  OverflowButton: FC<PropsWithChildren<MenuChildProps>>;
};

export const Menu: MenuType = ({ children }) => {
  const [showMoreElement, setShowMoreElement] = useState<HTMLElement | null>(
    null
  );
  const [popupElement, setPopupElement] = useState<HTMLElement | null>(null);
  const popper = usePopper(showMoreElement, popupElement, {
    placement: "bottom-end",
  });

  return (
    <HeadlessMenu as="div" className="relative ml-3">
      {({ open }) => {
        const res = mapChildrenSafe(children, (child) =>
          cloneElement(child, {
            open,
            setShowMoreElement,
            setPopupElement,
            popper,
          })
        );
        return res;
      }}
    </HeadlessMenu>
  );
};

const ItemButton: MenuType["ItemButton"] = ({
  label,
  className,
  onClick,
  variant = "default",
}) => {
  return (
    <HeadlessMenu.Item>
      {({ active }) => (
        <button
          className={classNames(
            active && itemActiveStyles[variant],
            itemBaseStyles[variant],
            "block w-full px-4 py-2 text-left text-sm",
            className
          )}
          onClick={onClick}
          type="button"
        >
          {label}
        </button>
      )}
    </HeadlessMenu.Item>
  );
};
Menu.ItemButton = ItemButton;

const RawLink = ({
  to,
  children,
  className,
}: PropsWithChildren<{ to: string; className: string }>) => (
  <a href={to} className={className}>
    {children}
  </a>
);

const ItemLink: MenuType["ItemLink"] = ({
  label,
  className,
  to,
  rawLink,
  variant = "default",
}) => {
  const LinkElement = rawLink ? RawLink : Link;

  return (
    <HeadlessMenu.Item>
      {({ active }) => (
        <LinkElement
          to={to}
          className={classNames(
            active && itemActiveStyles[variant],
            itemBaseStyles[variant],
            "block w-full px-4 py-2 text-left text-sm text-gray-700",
            className
          )}
        >
          {label}
        </LinkElement>
      )}
    </HeadlessMenu.Item>
  );
};
Menu.ItemLink = ItemLink;

const Button: MenuType["Button"] = ({ children, setShowMoreElement }) => {
  return (
    <div>
      <HeadlessMenu.Button
        ref={setShowMoreElement}
        className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
      >
        {children}
        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </HeadlessMenu.Button>
    </div>
  );
};
Menu.Button = Button;

const OverflowButton: MenuType["OverflowButton"] = ({ setShowMoreElement }) => {
  return (
    <HeadlessMenu.Button ref={setShowMoreElement} className="flex items-center">
      <EllipsisVerticalIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
    </HeadlessMenu.Button>
  );
};
Menu.OverflowButton = OverflowButton;

Menu.RawButton = HeadlessMenu.Button;

const Section: MenuType["Section"] = ({ children }) => {
  return <div className="py-1">{children}</div>;
};
Menu.Section = Section;

const Items: MenuType["Items"] = ({
  children,
  open,
  setPopupElement,
  popper,
}) => {
  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <div
            ref={setPopupElement}
            style={popper?.styles.popper}
            {...popper?.attributes.popper}
          >
            <HeadlessMenu.Items
              static
              as={motion.div}
              initial={{ opacity: 0, scale: "95%" }}
              animate={{ opacity: 1, scale: "100%" }}
              exit={{ opacity: 0, scale: "95%" }}
              className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              {children}
            </HeadlessMenu.Items>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
};
Menu.Items = Items;
