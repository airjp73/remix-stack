import { Dialog } from "@headlessui/react";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import type { FC, ReactNode } from "react";

type ModalProps = {
  onClose: () => void;
  initialFocus?: React.MutableRefObject<HTMLElement | null> | undefined;
  children?: ReactNode;
};

export type ModalType = FC<
  ModalProps & {
    open: boolean;
  }
> & {
  Actions: FC<{ className?: string; children?: ReactNode }>;
  Title: FC<{ className?: string; children?: ReactNode }>;
  Dialog: FC<ModalProps>;
};

export const Modal: ModalType = ({ open, onClose, children, initialFocus }) => {
  return (
    <AnimatePresence>
      {open && (
        <ModalDialog onClose={onClose} initialFocus={initialFocus}>
          {children}
        </ModalDialog>
      )}
    </AnimatePresence>
  );
};

const ModalDialog: ModalType["Dialog"] = ({
  children,
  onClose,
  initialFocus,
}) => {
  return (
    <Dialog
      key="modal"
      data-testid="modal"
      as={motion.div}
      className="fixed inset-0 z-20 overflow-y-auto"
      initialFocus={initialFocus}
      onClose={onClose}
      static
      open
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <Dialog.Overlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "linear", duration: 0.3 }}
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
        />

        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <motion.div
          className="inline-block overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 1 }} // for some reason the modal falls behind the overlay when y is 0
          exit={{ opacity: 0, y: 16 }}
          transition={{ type: "linear", duration: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </Dialog>
  );
};
Modal.Dialog = ModalDialog;

const Actions: ModalType["Actions"] = ({ children, className }) => {
  return (
    <div
      className={classNames(
        "mt-5 sm:mt-4 sm:flex sm:flex-row-reverse",
        className
      )}
    >
      {children}
    </div>
  );
};
Modal.Actions = Actions;

const Title: ModalType["Title"] = ({ children, className }) => {
  return (
    <Dialog.Title
      className={classNames(
        "text-lg font-medium leading-6 text-gray-900",
        className
      )}
    >
      {children}
    </Dialog.Title>
  );
};
Modal.Title = Title;
