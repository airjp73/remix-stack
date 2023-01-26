import { Listbox } from "@headlessui/react";
import {
  CheckIcon,
  ExclamationCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import type { Modifier } from "@popperjs/core";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useState } from "react";
import { usePopper } from "react-popper";
import { Portal } from "../internal/Portal";
import { HiddenInput } from "./HiddenInput";

export type SelectProps<T> = {
  items: T[];
  getItemValue: (item: T) => string;
  renderOption: (
    item: T,
    info: { selected: boolean; active: boolean; disabled: boolean }
  ) => ReactNode;
  label?: string;
  "aria-label"?: string;
  name: string;
  className?: string;
  error?: string;
  value?: T;
  onChange?: (item: T) => void;
};

const sameWidth: Modifier<"sameWidth", object> = {
  name: "sameWidth",
  enabled: true,
  phase: "beforeWrite",
  requires: ["computeStyles"],
  fn: ({ state }) => {
    state.styles.popper.width = `${state.rects.reference.width}px`;
  },
  effect: ({ state }) => {
    state.elements.popper.style.width = `${
      (state.elements.reference as any).offsetWidth
    }px`;
  },
};

export function Select<T>({
  items,
  getItemValue,
  renderOption,
  label,
  name,
  className,
  error,
  "aria-label": ariaLabel,
  onChange,
  value,
}: SelectProps<T>) {
  const [showMoreElement, setShowMoreElement] =
    useState<HTMLButtonElement | null>(null);
  const [popupElement, setPopupElement] = useState<HTMLDivElement | null>(null);
  const popper = usePopper(showMoreElement, popupElement, {
    modifiers: [sameWidth],
  });

  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className={className}>
          <Listbox.Label className="block text-sm font-medium text-gray-700">
            {label}
            <HiddenInput
              name={name}
              data-testid={`${name}-input`}
              value={value ? getItemValue(value) : ""}
            />
          </Listbox.Label>
          <div className="relative mt-1">
            <Listbox.Button
              ref={setShowMoreElement}
              className={classNames(
                "focus:border-brand-500 focus:ring-brand-500 relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 sm:text-sm",
                error &&
                  "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500"
              )}
              aria-label={ariaLabel}
            >
              <span className="flex h-6 items-center">
                {value &&
                  renderOption(value, {
                    // These properties are meant to modify the appearance of the options in the list
                    // so for the actual, selected item, we keep them false
                    selected: false,
                    active: false,
                    disabled: false,
                  })}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
              {error && (
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center pr-3">
                  <ExclamationCircleIcon
                    className="h-5 w-5 text-red-500"
                    aria-hidden="true"
                  />
                </div>
              )}
            </Listbox.Button>

            <Portal>
              <AnimatePresence>
                {open && (
                  <div
                    className="z-10"
                    ref={setPopupElement}
                    style={popper.styles.popper}
                    {...popper.attributes.popper}
                  >
                    <Listbox.Options
                      key="listbox-options"
                      static
                      className="mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                      as={motion.ul}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "tween", duration: 0.15 }}
                    >
                      {items.map((item) => (
                        <Listbox.Option
                          key={getItemValue(item)}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "bg-brand-600 text-white"
                                : "text-gray-900",
                              "relative cursor-default select-none py-2 pl-3 pr-9"
                            )
                          }
                          value={item}
                        >
                          {({ selected, active, disabled }) => (
                            <>
                              <div className="flex h-6 items-center">
                                {renderOption(item, {
                                  selected,
                                  active,
                                  disabled,
                                })}
                              </div>
                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? "text-white" : "text-brand-600",
                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                  )}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                )}
              </AnimatePresence>
            </Portal>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600" id="student-select-error">
              {error}
            </p>
          )}
        </div>
      )}
    </Listbox>
  );
}
