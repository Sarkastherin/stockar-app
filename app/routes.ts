import { type RouteConfig, index, layout, route, prefix } from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),
  route("forgot-password", "routes/forgot-password.tsx"),
  route("reset-password", "routes/reset-password.tsx"),
  route("change-password", "routes/change-password.tsx"),
  route("inactive", "routes/inactive.tsx"),
  layout("layouts/main.tsx", [
    // USER+: home y registro de movimientos
    index("routes/home.tsx"),
    ...prefix("movimientos", [
      route("nuevo", "routes/movimientos/nuevo.tsx"),
    ]),

    // SUPERVISOR+: todo excepto gestión de usuarios
    layout("components/SupervisorRoute.tsx", [
      route("productos", "routes/productos/index.tsx"),
      route("stock", "routes/stock/index.tsx"),
      ...prefix("movimientos", [
        index("routes/movimientos/index.tsx"),
      ]),
      ...prefix("configuraciones", [
        index("routes/configuraciones/index.tsx"),
        route("productos", "routes/configuraciones/productos.tsx"),
      ]),
    ]),

    // ADMIN: gestión de usuarios
    layout("components/AdminRoute.tsx", [
      ...prefix("configuraciones", [
        route("usuarios", "routes/configuraciones/usuarios.tsx"),
      ]),
    ]),
  ]),

] satisfies RouteConfig;
