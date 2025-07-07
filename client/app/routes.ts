import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("users", "routes/users.tsx"),
  route("companies", "routes/companies.tsx"),
  route("products", "routes/products.tsx"),
  route("inventory", "routes/inventory.tsx"),
  route("customers", "routes/customers.tsx"),
] satisfies RouteConfig;
