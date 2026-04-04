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
import { useEffect, useMemo, useState } from "react";
import { getIcon } from "~/components/IconComponent";
import { FiAlertCircle, FiPackage } from "react-icons/fi";
import { HiOutlineArrowsUpDown } from "react-icons/hi2";
import { tiposMovimiento } from "~/types/movimientos";
import { relativeTimeFormat } from "~/utils/functions";
import { useMovementsServices, useStockServices } from "~/services/useCrud";
import { useNavItems } from "~/hooks/useNavItems";
import { useAuth } from "~/context/AuthContext";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "StockAR" },
    { name: "description", content: "Centro de operaciones de StockAR" },
  ];
}

export default function Home() {
  const { movimientos, getMovimientos } = useDataContext();
  const stockServices = useStockServices();
  const { user } = useAuth();
  const { quickActions } = useNavItems();
  const [operationalSummary, setOperationalSummary] = useState({
    totalProducts: 0,
    productsInStock: 0,
    productsWithoutStock: 0,
    movementsToday: 0,
  });

  useEffect(() => {
    if (!movimientos) {
      getMovimientos();
    }
  }, [getMovimientos, movimientos]);

  useEffect(() => {
    const loadOperationalSummary = async () => {
      const [
        totalProductsResult,
        productsInStockResult,
        productsWithoutStockResult,
      ] = await Promise.all([
        stockServices.read({
          limit: 1,
          offset: 0,
          query: { active: true },
        }),
        stockServices.read({
          limit: 1,
          offset: 0,
          query: { active: true, has_stock: true },
        }),
        stockServices.read({
          limit: 1,
          offset: 0,
          query: { active: true, has_stock: false },
        }),
      ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const movementsToday =
        movimientos?.filter((movimiento) => {
          const movementDate = new Date(movimiento.created_at);
          movementDate.setHours(0, 0, 0, 0);
          return movementDate.getTime() === today.getTime();
        }).length ?? 0;

      setOperationalSummary({
        totalProducts: totalProductsResult.pagination?.total ?? 0,
        productsInStock: productsInStockResult.pagination?.total ?? 0,
        productsWithoutStock: productsWithoutStockResult.pagination?.total ?? 0,
        movementsToday,
      });
    };

    void loadOperationalSummary();
  }, [movimientos, stockServices]);

  const summaryCards = [
    {
      label: "Productos activos",
      value: operationalSummary.totalProducts,
      icon: FiPackage,
      accent: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    },
    {
      label: "Con stock",
      value: operationalSummary.productsInStock,
      icon: FaBoxesStacked,
      accent:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    },
    {
      label: "Sin stock",
      value: operationalSummary.productsWithoutStock,
      icon: FiAlertCircle,
      accent:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    },
    {
      label: "Movimientos hoy",
      value: operationalSummary.movementsToday,
      icon: HiOutlineArrowsUpDown,
      accent:
        "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    },
  ];
  return (
    <main className="mt-10">
      <section className="flex gap-6 max-w-6xl mx-auto flex-col md:flex-row">
        <Card className="hidden md:block flex-2 border-0 shadow-lg bg-linear-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Resumen operativo
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                Centro de control del inventario
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                Vista rápida del estado del stock y del ritmo de movimientos del
                día.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white dark:bg-slate-100 dark:text-slate-900">
              Hoy
            </div>
          </div>

          <div className="mt-2 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {item.label}
                    </span>
                    <span className={`rounded-xl p-2 ${item.accent}`}>
                      <Icon size={18} />
                    </span>
                  </div>
                  <div className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {item.value}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-100/70 p-4 dark:border-slate-600 dark:bg-slate-800/50 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {operationalSummary.productsWithoutStock > 0
                  ? `Hay ${operationalSummary.productsWithoutStock} productos sin stock.`
                  : "No hay productos sin stock en este momento."}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Revisa el inventario para detectar faltantes y registrar ajustes
                si hace falta.
              </p>
            </div>
            {user?.role !== "USER" && (
              <NavLink
                to="/stock"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
              >
                Ver inventario
              </NavLink>
            )}
          </div>
        </Card>
        <Card className="flex-1">
          <div className="flex gap-2 items-center">
            <TbTableShortcut />
            <h3 className="font-semibold text-sm">Acciones rápidas</h3>
          </div>
          <div className="flex flex-col gap-3">
            {quickActions.map((action) => (
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
      {movimientos && (
        <section className="mt-8 max-w-6xl mx-auto">
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
                {movimientos.slice(0, 5).map((mov) => (
                  <TableRow
                    key={mov.id}
                    className="bg-gray-50 dark:border-gray-500 border-gray-300  dark:bg-gray-800 shadow-2xl"
                  >
                    <TableCell>{mov.product_name}</TableCell>
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
