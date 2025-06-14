import type { ReactNode } from "react";
import { Route } from "react-router";

export default function renderRoutes<T extends ReactNode>(
  paths: string[],
  element: T
) {
  return paths.map((path) => (
    <Route key={path} path={path} element={element} />
  ));
}
