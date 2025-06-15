import { useEffect, useState } from "react";
import { Routes, Route, Navigate, NavLink, Link } from "react-router";
import type { GenreMap, Movie } from "./types/movie";
import SearchResults from "./views/SearchResults";
import WatchlistView from "./views/WatchlistView";
import useLocalStorage from "./hooks/useLocalStorage";
import renderRoutes from "./utils/renderRoutes";
import { createGenreMap, getGenres } from "./api/tmdb";
import "./App.css";
import Logo from "./assets/logo.svg";

function App() {
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<Error | null>(null);
  const [ariaMessage, setAriaMessage] = useState<string>("");
  const [genreMap, setGenreMap] = useState<GenreMap>({});
  const [watchlist, setWatchlist] = useLocalStorage<Movie[]>("watchlist", []);

  useEffect(() => {
    //Init genres at start
    async function loadGenres() {
      const genres = createGenreMap(await getGenres());
      setGenreMap(genres);
    }

    loadGenres();
  });

  return (
    <div className="container py-4">
      {/* aria-live annoucment message for state changes */}
      <div id="announce" aria-live="polite" className="visually-hidden">
        <p>{ariaMessage}</p>
      </div>
      <header className="text-center mb-4">
        <nav className="navbar navbar-expand-sm bg-body-tertiary">
          <div className="container-fluid">
            <Link
              to="/"
              className="navbar-brand mb-0 d-flex align-items-center"
            >
              <img
                src={Logo}
                alt="Movie Watchlist App Logo"
                width={30}
                height={40}
              />
              <p className="d-sm-none m-0 ps-3">Watchlist App</p>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#Navbar"
              aria-controls="Navbar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="Navbar">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink to="/search" className="nav-link">
                    Search
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/watchlist" className="nav-link">
                    <span>Watchlist</span>
                    <span> ({watchlist && watchlist.length})</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <Routes>
        {renderRoutes(
          ["/", "/search"],
          <SearchResults
            apiLoading={apiLoading}
            apiError={apiError}
            setApiLoading={setApiLoading}
            setApiError={setApiError}
            setAriaMessage={setAriaMessage}
            watchlist={watchlist}
            setWatchlist={setWatchlist}
            genreMap={genreMap}
          />
        )}
        <Route
          path="/watchlist"
          element={
            <WatchlistView watchlist={watchlist} setWatchlist={setWatchlist} />
          }
        />
        <Route path="*" element={<Navigate to="/search" replace />} />
      </Routes>
    </div>
  );
}

export default App;
