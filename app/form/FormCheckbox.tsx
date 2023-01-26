import {
  Checkbox,
  type CheckboxProps,
} from "../design-system/controls/Checkbox";
import { useField } from "remix-validated-form";

export const FormCheckbox = ({ name, ...rest }: CheckboxProps) => {
  const { getInputProps } = useField(name);
  return <Checkbox {...getInputProps(rest)} />;
};
