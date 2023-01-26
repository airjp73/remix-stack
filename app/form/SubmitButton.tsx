import { LoadableButton } from "../design-system/Button";
import type { ComponentProps, FC } from "react";
import { useIsSubmitting } from "remix-validated-form";

export type SubmitButtonProps = Omit<
  ComponentProps<typeof LoadableButton>,
  "isLoading"
>;

export const SubmitButton: FC<SubmitButtonProps> = (props) => {
  const isSubmitting = useIsSubmitting();
  return <LoadableButton type="submit" isLoading={isSubmitting} {...props} />;
};
