import { useEffect, useState } from "react";
import { Routes, Route, Navigate, NavLink, Link } from "react-router";
import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";
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
    <Container fluid>
      {/* aria-live annoucment message for state changes */}
      <div id="announce" aria-live="polite" className="visually-hidden">
        <p>{ariaMessage}</p>
      </div>
      <Navbar bg="body-tertiary" fixed="top" expand className="shadow-sm">
        <Container fluid>
          <Navbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center mb-0"
          >
            <img
              src={Logo}
              alt="Movie Watchlist App Logo"
              width={30}
              height={40}
            />
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/search">
              <i className="bi bi-search pe-1" /> Search
            </Nav.Link>
            <Nav.Link as={NavLink} to="/watchlist">
              {watchlist.length > 0 ? (
                <i className="bi bi-bookmark-fill pe-1" />
              ) : (
                <i className="bi bi-bookmark pe-1" />
              )}
              Watchlist ({watchlist.length})
            </Nav.Link>
          </Nav>
          <ThemeSwitch
            userTheme={userTheme}
            activeTheme={activeTheme}
            setUserTheme={setUserTheme}
          />
        </Container>
      </Navbar>

      <main className="body-content">
        <Row className="justify-content-center">
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
									activeTheme={activeTheme}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Row>
      </main>

      <footer className="mt-5">
        <Row>
          <Col
            md={6}
            as="p"
            className="d-flex justify-content-center justify-content-md-end align-items-center"
          >
            Site Copyright Kyle Jackson 2025.
          </Col>
          <Col
            md={6}
            as="p"
            className="d-flex justify-content-center justify-content-md-start align-items-center"
          >
            <span className="me-3">Powered by</span>
            <img src={TMDB} alt="TMDB" width={100} height={43} />
          </Col>
        </Row>
      </footer>
    </Container>
  );
}

export default App;
