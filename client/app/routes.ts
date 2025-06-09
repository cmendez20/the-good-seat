import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("theatres/:theatreId", "routes/theatre.tsx"),
] satisfies RouteConfig;
