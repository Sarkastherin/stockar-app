import { CSVLink } from "react-csv";
import { useState } from "react";
import type { CommonPropTypes } from "react-csv/components/CommonPropTypes";
import type { Data } from "react-csv/lib/core";
import { Button } from "flowbite-react";

const formatNumberForCSV = (value: number) => String(value).replace(".", ",");

export const ButtonExport = ({ data, headers, filename }: CommonPropTypes) => {
  const [separator, setSeparator] = useState<"," | ";">(";");
  
  // Procesar datos para formatear números según headers
  const processedData = Array.isArray(data)
    ? data.map((row: any) => {
        const newRow = { ...row };
        headers?.forEach((header: any) => {
          if (header.type === "number" && newRow[header.key] !== undefined) {
            newRow[header.key] = formatNumberForCSV(Number(newRow[header.key]));
          }
        });
        return newRow;
      })
    : data;
  return (
    <div className="text-sm inline-flex divide-x divide-gray-300 overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
      {/* Botón Exportar */}
      <CSVLink
        data={processedData}
        headers={headers}
        separator={separator}
        filename={filename}
        className="bg-green-600 text-white px-3 py-1.5 font-medium hover:bg-green-700 transition"
      >
        Exportar
      </CSVLink>
      {/* Selector de separador */}
      <div className="relative">
        <select
          className="dark:bg-gray-800 appearance-none w-full h-full px-3 py-1.5 text-gray-700 dark:text-gray-200 bg-transparent pr-8 focus:outline-none cursor-pointer"
          onChange={(e) => setSeparator(e.target.value as "," | ";")}
          value={separator}
        >
          <option disabled>Separador</option>
          <option value=",">coma [,]</option>
          <option value=";">punto y coma [;]</option>
        </select>

        {/* Ícono de flecha */}
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
          <svg
            className="h-4 w-4 text-gray-500 dark:text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
