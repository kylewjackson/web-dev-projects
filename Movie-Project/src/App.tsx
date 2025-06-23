import { useEffect, useState } from "react";
import { Routes, Route, Navigate, NavLink, Link } from "react-router";
import type { GenreMap, Movie, ShowcaseTabs } from "./types/movie";
import type { Theme } from "./types/preferences";
import SearchView from "./views/SearchView";
import WatchlistView from "./views/WatchlistView";
import MovieDetailView from "./views/MovieDetailView";
import useLocalStorage from "./hooks/useLocalStorage";
import useSystemTheme from "./hooks/useSystemTheme";
import renderRoutes from "./utils/renderRoutes";
import { createGenreMap, getGenres } from "./api/tmdb";
import "./App.css";
import Logo from "./assets/logo.svg";
import TMDB from "./assets/tmdb.svg";
import ThemeSwitch from "./components/ThemeSwitch";

function App() {
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<Error | null>(null);
  const [ariaMessage, setAriaMessage] = useState<string>("");
  const [genreMap, setGenreMap] = useState<GenreMap>({});
  const [watchlist, setWatchlist] = useLocalStorage<Movie[]>("watchlist", []);

  //Theme
  const systemTheme = useSystemTheme();
  const [userTheme, setUserTheme] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || "auto"
  );
  const activeTheme = userTheme === "auto" ? systemTheme : userTheme;

  //Search
  const [movieResults, setMovieResults] = useState<Movie[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [query, setQuery] = useState<string>("");

  //Showcase
  const [showcaseTabs, setShowcaseTabs] = useState<ShowcaseTabs>({
    popular: [],
    top_rated: [],
    upcoming: [],
  });

  useEffect(() => {
    //Init genres at start
    async function loadGenres() {
      const genres = createGenreMap(await getGenres());
      setGenreMap(genres);
    }

    loadGenres();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", activeTheme);
    localStorage.setItem("theme", userTheme);
  }, [activeTheme, userTheme]);

  function toggleWatchlist(movie: Movie) {
    setWatchlist((prev) =>
      prev.some((listMovie) => listMovie.id === movie.id)
        ? prev.filter((listMovie) => listMovie.id !== movie.id)
        : [movie, ...prev]
    );
  }

  return (
    <div className="container-fluid">
      {/* aria-live annoucment message for state changes */}
      <div id="announce" aria-live="polite" className="visually-hidden">
        <p>{ariaMessage}</p>
      </div>
      <header className="text-center fixed-top">
        <nav className="navbar navbar-expand bg-body-tertiary shadow-sm">
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
            </Link>
            <div
              className="collapse navbar-collapse justify-content-between"
              id="Navbar"
            >
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink to="/search" className="nav-link">
                    <i className="bi bi-search pe-1" />
                    <span>Search</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/watchlist" className="nav-link">
                    {watchlist && watchlist.length > 0 ? (
                      <i className="bi bi-bookmark-fill pe-1" />
                    ) : (
                      <i className="bi bi-bookmark pe-1" />
                    )}
                    <span>Watchlist</span>
                    <span> ({watchlist && watchlist.length})</span>
                  </NavLink>
                </li>
              </ul>
              <ThemeSwitch
                userTheme={userTheme}
                activeTheme={activeTheme}
                setUserTheme={setUserTheme}
              />
            </div>
          </div>
        </nav>
      </header>

      <main className="body-content row justify-content-center">
        <Routes>
          {renderRoutes(
            ["/", "/search"],
            <SearchView
              apiLoading={apiLoading}
              apiError={apiError}
              setApiLoading={setApiLoading}
              setApiError={setApiError}
              setAriaMessage={setAriaMessage}
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
              genreMap={genreMap}
              movieResults={movieResults}
              setMovieResults={setMovieResults}
              hasSearched={hasSearched}
              setHasSearched={setHasSearched}
              query={query}
              setQuery={setQuery}
              showcaseTabs={showcaseTabs}
              setShowcaseTabs={setShowcaseTabs}
            />
          )}
          <Route
            path="/watchlist"
            element={
              <WatchlistView
                watchlist={watchlist}
                setWatchlist={setWatchlist}
                toggleWatchlist={toggleWatchlist}
              />
            }
          />
          <Route
            path="/movie/:id/:slug"
            element={
              <MovieDetailView
                apiLoading={apiLoading}
                apiError={apiError}
                setApiLoading={setApiLoading}
                setApiError={setApiError}
                setAriaMessage={setAriaMessage}
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="row mt-5">
        <p className="col-md-6 d-flex justify-content-center justify-content-md-end align-items-center">
          Site Copyright Kyle Jackson 2025.
        </p>
        <p className="col-md-6  d-flex justify-content-center justify-content-md-start align-items-center">
          <span className="me-3">Powered by</span>
          <img src={TMDB} alt="TMDB" width={100} height={43} />
        </p>
      </footer>
    </div>
  );
}

export default App;
