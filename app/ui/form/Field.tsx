import * as React from "react";
import { useField } from "remix-validated-form";
import { Input } from "../Input";
import { Label } from "../Label";
import invariant from "tiny-invariant";

//////// Field
export type FieldProps = React.PropsWithChildren<{
  name: string;
  description?: string;
  label: string;
}>;

export type FieldContextType = {
  name: string;
  id: string;
  errorId?: string;
  descriptionId?: string;
};

const FieldContext = React.createContext<FieldContextType | null>(null);

const Field = ({ name, description, children, label }: FieldProps) => {
  const id = React.useId();
  const idForError = React.useId();
  const idforDescription = React.useId();

  const { error } = useField(name);

  const errorId = error ? idForError : undefined;
  const descriptionId = description ? idforDescription : undefined;

  const context = React.useMemo(
    () =>
      ({
        name,
        id,
        errorId,
        descriptionId,
      } satisfies FieldContextType),
    [name, id, errorId, descriptionId]
  );

  return (
    <FieldContext.Provider value={context}>
      <div>
        <Label htmlFor={id}>{label}</Label>
        {children}
        {error && <p id={idForError}>{error}</p>}
      </div>
    </FieldContext.Provider>
  );
};

const useFieldContext = () => {
  const context = React.useContext(FieldContext);
  invariant(context, "Field components must be rendered within a Field");
  return context;
};

//////// Input
export type FieldInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "name" | "id"
>;

const FieldInput = React.forwardRef<HTMLInputElement, FieldInputProps>(
  ({ ...props }, ref) => {
    const { name, id, errorId, descriptionId } = useFieldContext();
    const { getInputProps, error } = useField(name);

    return (
      <Input
        ref={ref}
        {...getInputProps({
          ...props,
          invalid: !!error,
          id,
          "aria-describedby":
            [errorId, descriptionId].filter(Boolean).join(" ") || undefined,
        })}
      />
    );
  }
);
FieldInput.displayName = "FieldInput";

export { Field, FieldInput };
