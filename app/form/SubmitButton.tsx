import { Button } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { useIsSubmitting } from "remix-validated-form";

export const SubmitButton = ({ children }: PropsWithChildren) => {
  const isSubmitting = useIsSubmitting();
  return (
    <Button isLoading={isSubmitting} type="submit">
      {children}
    </Button>
  );
};
