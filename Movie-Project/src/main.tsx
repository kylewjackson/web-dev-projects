// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  ScrollRestoration,
  Navigate,
  RouterProvider,
} from "react-router";

import "./scss/bootstrap.scss";
import "./scss/global.scss";

import App from "./App";
import SearchView from "./views/SearchView";
import WatchlistView from "./views/WatchlistView";
import MovieDetailView from "./views/MovieDetailView";

const router = createBrowserRouter(
  [
    {
      element: (
        <>
          <ScrollRestoration />
          <App />
        </>
      ),
      children: [
        { path: "/", element: <SearchView /> },
        { path: "search", element: <SearchView /> },
        { path: "watchlist", element: <WatchlistView /> },
        { path: "detail/:id/:slug", element: <MovieDetailView /> },
        { path: "*", element: <Navigate to="/" replace /> },
      ],
    },
  ],
  {
    basename: "/movie",
  }
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
