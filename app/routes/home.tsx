import type { Route } from "./+types/home";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Card,
  Badge,
} from "flowbite-react";
import { NavLink } from "react-router";
import { FaBoxesStacked } from "react-icons/fa6";
import { TbTableShortcut } from "react-icons/tb";
import { useDataContext } from "~/context/DataContext";
import { useEffect } from "react";
import { getIcon } from "~/components/IconComponent";
import { FiDownload, FiUpload } from "react-icons/fi";
import { tiposMovimiento } from "~/types/movimientos";
import { relativeTimeFormat } from "~/utils/functions";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "StockAR" },
    { name: "description", content: "Centro de operaciones de StockAR" },
  ];
}
const QuickActionLink = [
  {
    name: "Agregar entrada",
    to: "/movimientos/nuevo?type=entrada",
    icon: {
      component: FiDownload,
      color: "text-green-500 dark:text-green-400",
      size: 20,
    },
    color: "bg-green-200 dark:bg-green-900",
  },
  {
    name: "Agregar salida",
    to: "/movimientos/nuevo?type=salida",
    icon: {
      component: FiUpload,
      color: "text-red-500 dark:text-red-400",
      size: 20,
    },
    color: "bg-red-200 dark:bg-red-900",
  },
  {
    name: "Ver stock",
    to: "/stock",
    icon: {
      component: FaBoxesStacked,
      color: "text-blue-500 dark:text-blue-400",
      size: 20,
    },
    color: "bg-blue-200 dark:bg-blue-900",
  },
];
export default function Home() {
  const {
    movimientosConDetalles,
    getMovimientosConDetalles,
  } = useDataContext();

  useEffect(() => {
    if (!movimientosConDetalles) {
      getMovimientosConDetalles();
    }
  }, [movimientosConDetalles]);
  return (
    <main className="mt-10">
      <section className="flex gap-6 max-w-6xl mx-auto flex-col md:flex-row">
        <Card className="flex-2"></Card>
        <Card className="flex-1">
          <div className="flex gap-2 items-center">
            <TbTableShortcut />
            <h3 className="font-semibold text-sm">Acciones rápidas</h3>
          </div>
          <div className="flex flex-col gap-3">
            {QuickActionLink.map((action) => (
              <NavLink
                key={action.to}
                to={action.to}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md px-4 py-2 text-sm flex items-center gap-3 transition-colors border border-gray-300 dark:border-gray-600"
              >
                <div
                  className={`p-2 rounded-full ${action.color} flex items-center justify-center`}
                >
                  {getIcon({
                    icon: action.icon.component,
                    color: action.icon.color,
                    size: action.icon.size,
                  })}
                </div>
                {action.name}
              </NavLink>
            ))}
          </div>
        </Card>
      </section>
      {movimientosConDetalles && (
        <section className="mt-10 max-w-6xl mx-auto">
          <h3 className="mb-4 font-medium text-lg">Ultimos movimientos</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell className="bg-indigo-100">
                    Producto
                  </TableHeadCell>
                  <TableHeadCell className="bg-indigo-100">Tipo</TableHeadCell>
                  <TableHeadCell className="bg-indigo-100">
                    Cantidad
                  </TableHeadCell>
                  <TableHeadCell className="bg-indigo-100">Fecha</TableHeadCell>
                  <TableHeadCell className="bg-indigo-100">
                    Creado por
                  </TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y dark:border-gray-700">
                {movimientosConDetalles.slice(0, 5).map((mov) => (
                  <TableRow
                    key={mov.id}
                    className="bg-gray-50 dark:border-gray-500 border-gray-300  dark:bg-gray-800 shadow-2xl"
                  >
                    <TableCell>{mov.name_product}</TableCell>
                    <TableCell className="w-40">
                      <Badge
                        className="w-fit"
                        color={
                          tiposMovimiento.find((t) => t.value === mov.type)
                            ?.type || "default"
                        }
                      >
                        {tiposMovimiento.find((t) => t.value === mov.type)
                          ?.label || mov.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-px">{mov.qty}</TableCell>
                    <TableCell className="w-50">
                      {relativeTimeFormat(mov.created_at)}
                    </TableCell>
                    <TableCell className="w-50">{mov.creator}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}
    </main>
  );
}
