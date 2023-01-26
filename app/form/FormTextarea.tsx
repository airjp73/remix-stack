import type { InputProps } from "../design-system/controls/Input";
import { Textarea } from "../design-system/controls/Textarea";
import { useField } from "remix-validated-form";

export const FormTextarea = ({ name, ...rest }: InputProps) => {
  const { getInputProps, error } = useField(name);
  return <Textarea {...getInputProps(rest)} error={error} />;
};
