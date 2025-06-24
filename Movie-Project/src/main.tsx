// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration,
  Navigate,
} from "react-router";
import "./scss/bootstrap.scss";
import "./scss/global.scss";

import App from "./App";
import SearchView from "./views/SearchView";
import WatchlistView from "./views/WatchlistView";
import MovieDetailView from "./views/MovieDetailView";

const router = createBrowserRouter([
  {
    element: (
      <>
        <ScrollRestoration />
        <App />
      </>
    ),
    children: [
      // { index: true, element: <Navigate to="/search" replace /> },
      {
        path: "/",
        element: <SearchView />,
      },
      {
        path: "search",
        element: <SearchView />,
      },
      {
        path: "watchlist",
        element: <WatchlistView />,
      },
      {
        path: "movie/:id/:slug",
        element: <MovieDetailView />,
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
