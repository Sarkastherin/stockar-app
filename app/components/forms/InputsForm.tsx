import {
  Label,
  TextInput,
  Select as FlowbiteSelect,
  HelperText,
  ListGroup,
  ListGroupItem,
  Textarea as FlowbiteTextarea
} from "flowbite-react";

import {
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
  useState,
} from "react";
export const Input = ({
  error,
  requiredField = false,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  requiredField?: boolean;
}) => {
  return (
    <div className="w-full">
      <div className="mb-2 block">
        <Label htmlFor={props.id}>{props.label} {requiredField && <span className="text-red-500">*</span>}</Label>
      </div>
      <TextInput
        type={props.type || "text"}
        {...props}
        color={error ? "failure" : "gray"}
      />
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
  requiredField = false,
  emptyOption = "Seleccione una opción",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
  label: string;
  requiredField?: boolean;
  options: { value: string; label: string; disabled?: boolean }[];
  emptyOption?: string;
}) => {
  return (
    <div className="w-full">
      <div className="mb-2 block">
        <Label htmlFor={props.id}>{props.label} {requiredField && <span className="text-red-500">*</span>}</Label>
      </div>
      <FlowbiteSelect {...props} color={error ? "failure" : "gray"}>
        <option value="">{emptyOption}</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            hidden={option.disabled}
          >
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

export const SelectWithSearch = <T extends { id: string; name: string }>({
  input,
  search,
  data,
  error,
  requiredField = false,
}: {
  input: {
    label: string;
    placeholder?: string;
    value: string;
  };
  search: {
    placeholder?: string;
  };
  data: {
    items: T[];
    onSelect: (item: T) => void;
  };
  error: string
  requiredField?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [filterData, setFilterData] = useState<T[]>(data.items);
  return (
    <div className="space-y-2">
      <Input
        label={input.label}
        placeholder={input.placeholder}
        readOnly
        value={input.value}
        onClick={() => setOpen((prev) => !prev)}
        error={error}
        requiredField={requiredField}
      />
      <div className={`${open ? "block" : "hidden"}`}>
        <TextInput
          type="search"
          placeholder={search.placeholder}
          onChange={(e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredItems = data.items.filter((item) =>
              item.name.toLowerCase().includes(searchTerm),
            );
            setFilterData(filteredItems);
          }}
        />
        <ListGroup className={`mt-2 max-h-50 overflow-y-scroll p-1`}>
          {filterData.map((item) => (
            <ListGroupItem
              key={item.id}
              onClick={() => {
                data.onSelect(item);
                setOpen(false);
              }}
            >
              {item.name}
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};
export const Textarea = ({
  error,
  requiredField = false,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  requiredField?: boolean;
}) => {
  return (
    <div className="w-full">
      <div className="mb-2 block">
        <Label htmlFor={props.id}>{props.label} {requiredField && <span className="text-red-500">*</span>}</Label>
      </div>
      <FlowbiteTextarea
        {...props}
        color={error ? "failure" : "gray"}
      />
      {error && (
        <HelperText className="text-red-500 dark:text-red-400">
          {error}
        </HelperText>
      )}
    </div>
  );
};
