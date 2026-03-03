import { Label, TextInput, Select as FlowbiteSelect, HelperText } from "flowbite-react";

import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
} from "react";
export const Input = ({
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) => {
  return (
    <div className="w-full">
      <div className="mb-2 block">
        <Label htmlFor={props.id}>{props.label}</Label>
      </div>
      <TextInput type={props.type || "text"} {...props} color={error ? "failure" : "gray"} />
      {error && (
        <HelperText className="text-red-500 dark:text-red-400">
          {error}
        </HelperText>
      )}
    </div>
  );
};
export const Select = ({
  error,
  options,
  emptyOption = "Seleccione una opción",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
  label: string;
  options: { value: string; label: string }[];
  emptyOption?: string;
}) => {
  return (
    <div className="w-full">
      <div className="mb-2 block">
        <Label htmlFor={props.id}>{props.label}</Label>
      </div>
      <FlowbiteSelect {...props} color={error ? "failure" : "gray"}>
        <option value="">{emptyOption}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </FlowbiteSelect>
       {error && (
        <HelperText className="text-red-500 dark:text-red-400">
          {error}
        </HelperText>
      )}
    </div>
  );
};
