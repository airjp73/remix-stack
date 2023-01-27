import { Button } from "@chakra-ui/react";
import type { ComponentProps } from "react";
import { useIsSubmitting } from "remix-validated-form";

export type SubmitButtonProps = ComponentProps<typeof Button>;

export const SubmitButton = (props: SubmitButtonProps) => {
  const isSubmitting = useIsSubmitting();
  return <Button isLoading={isSubmitting} type="submit" {...props} />;
};
