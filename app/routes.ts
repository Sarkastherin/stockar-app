import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layouts/main.tsx", [
    index("routes/home.tsx"),
    route("productos", "routes/productos/index.tsx"),
  ]),

] satisfies RouteConfig;
