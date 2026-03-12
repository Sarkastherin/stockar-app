import { type RouteConfig, index, layout, route, prefix } from "@react-router/dev/routes";

export default [
  layout("layouts/main.tsx", [
    index("routes/home.tsx"),
    route("productos", "routes/productos/index.tsx"),
    ...prefix("configuraciones", [
      index("routes/configuraciones/index.tsx"),
      route("usuarios", "routes/configuraciones/usuarios.tsx"),
      route("productos", "routes/configuraciones/productos.tsx"),
    ]),
    ...prefix("movimientos", [
      index("routes/movimientos/index.tsx"),
      route("nuevo", "routes/movimientos/nuevo.tsx"),
    ]),
    route("stock", "routes/stock/index.tsx")
  ]),

] satisfies RouteConfig;
