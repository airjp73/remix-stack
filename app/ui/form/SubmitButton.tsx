import { Loader2 } from "lucide-react";
import * as React from "react";
import { useIsSubmitting } from "remix-validated-form";
import type { ButtonProps } from "../Button";
import { Button } from "../Button";

export type SubmitButtonProps = Omit<ButtonProps, "children"> & {
  loadingLabel?: string;
  label: string;
};

const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ disabled, label, loadingLabel, ...rest }, ref) => {
    const isSubmitting = useIsSubmitting();
    return (
      <Button disabled={disabled || isSubmitting} {...rest}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingLabel}
          </>
        ) : (
          label
        )}
      </Button>
    );
  }
);
SubmitButton.displayName = "Button";

export { SubmitButton };
