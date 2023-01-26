import { Input, type InputProps } from "../design-system/controls/Input";
import { useField } from "remix-validated-form";

export const FormInput = ({ name, ...rest }: InputProps) => {
  const { getInputProps } = useField(name);
  return <Input {...getInputProps(rest)} />;
};
