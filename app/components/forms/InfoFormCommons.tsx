import { Badge, Label } from "flowbite-react";
import { InfoField, formatDateTime } from "./InfoField";
import { IoChevronDown } from "react-icons/io5";
import { useState } from "react";
type InfoFormCommonsProps = {
  active: boolean;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  voidedAt?: string;
  voidedBy?: string;
  voidReason?: string;
};
export default function InfoFormCommons(props: InfoFormCommonsProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className="flex gap-1 text-blue-700 dark:text-blue-400 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <IoChevronDown
          className={`${open ? "rotate-180" : ""} transition-transform duration-300`}
        />
        <span className="text-xs font-medium">Mas detalles</span>
      </div>
      <div
        className={`overflow-hidden transition-max-height duration-300 ${open ? "max-h-screen" : "max-h-0"}`}
      >
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between mb-3 items-center">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Información del registro
            </h3>
            <div className="flex items-center gap-2">
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Estado:
              </Label>
              <Badge color={props.active ? "success" : "failure"}>
                {props.active ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <InfoField
              label="Fecha de creación"
              value={formatDateTime(props.createdAt)}
            />
            <div className="col-span-2">
              <InfoField label="Creado por" value={props.createdBy} />
            </div>
            <InfoField
              label="Última actualización"
              value={formatDateTime(props.updatedAt)}
            />
            <div className="col-span-2">
              <InfoField label="Actualizado por" value={props.updatedBy} />
            </div>
          </div>
        </div>
        {props.active === false && (
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Anulación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <InfoField
                label="Anulado en"
                value={formatDateTime(props.voidedAt)}
              />
              <div className="col-span-2">
                <InfoField label="Anulado por" value={props.voidedBy} />
              </div>
              <div className="col-span-3">
                <InfoField label="Motivo" value={props.voidReason} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
