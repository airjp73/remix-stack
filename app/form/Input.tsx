import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input as ChakraInput,
} from "@chakra-ui/react";
import { useField } from "remix-validated-form";

export type InputProps = {
  label: string;
  name: string;
  type?: string;
  description?: string;
};

export const Input = ({ label, name, type, description }: InputProps) => {
  const { getInputProps, error } = useField(name);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <ChakraInput {...getInputProps({ type })} />
      {description && <FormHelperText>description</FormHelperText>}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
