import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("app", "routes/app.tsx"),
  route("app/processing", "routes/app.processing.tsx"),
  route("app/dashboard", "routes/app.dashboard.tsx"),
] satisfies RouteConfig;
