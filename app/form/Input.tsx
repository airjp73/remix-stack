import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input as ChakraInput,
} from "@chakra-ui/react";
import type { ComponentProps } from "react";
import { useField } from "remix-validated-form";

export type InputProps = {
  label: string;
  name: string;
  type?: string;
  description?: string;
} & ComponentProps<typeof FormControl>;

export const Input = ({
  label,
  name,
  type,
  description,
  ...rest
}: InputProps) => {
  const { getInputProps, error } = useField(name);
  return (
    <FormControl isInvalid={!!error} {...rest}>
      <FormLabel>{label}</FormLabel>
      <ChakraInput {...getInputProps({ type })} />
      {description && <FormHelperText>description</FormHelperText>}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
