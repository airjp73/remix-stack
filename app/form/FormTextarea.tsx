import type { InputProps } from "design-system/components/controls/Input";
import { Textarea } from "design-system/components/controls/Textarea";
import { useField } from "remix-validated-form";

export const FormTextarea = ({ name, ...rest }: InputProps) => {
  const { getInputProps } = useField(name);
  return <Textarea {...getInputProps(rest)} />;
};
