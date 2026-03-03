import { Label } from "flowbite-react";

export const InfoField = ({
  label,
  value,
}: {
  label: string;
  value: string | boolean | undefined;
}) => {
  const displayValue = typeof value === "boolean" 
    ? (value ? "Activo" : "Inactivo")
    : value || "N/A";
    
  return (
    <div className="w-full">
      <div className="mb-1 block">
        <Label className="text-xs text-gray-600 dark:text-gray-400">
          {label}
        </Label>
      </div>
      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
        {displayValue}
      </div>
    </div>
  );
};
