import { Button } from "flowbite-react";

type EmptyTableStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyTableState({
  title = "No hay registros todavía",
  description = "Todavía no se cargaron datos para esta sección.",
  actionLabel,
  onAction,
}: EmptyTableStateProps) {
  return (
    <div className="py-10 px-4 text-center text-gray-600 dark:text-gray-300">
      <p className="text-base font-semibold">{title}</p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-4 mx-auto w-max">
          <Button color="indigo" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
