import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Outlet, NavLink, Link } from "react-router";
import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";
import type {
  GenreMap,
  HandleMovie,
  HandleMovies,
  HandleShowcase,
  Movie,
  ShowcaseTabs,
} from "./types/movie";
import type { Theme } from "./types/preferences";
import type { TMDBMovieList } from "./types/tmdb";
import useLocalStorage from "./hooks/useLocalStorage";
import useSystemTheme from "./hooks/useSystemTheme";
import { createGenreMap, getGenres } from "./api/tmdb";
import ThemeSwitch from "./components/ThemeSwitch";
import "./App.css";
import Logo from "./assets/logo.svg";
import TMDB from "./assets/tmdb.svg";
export interface AppContextType {
  apiLoading: boolean;
  apiError: Error | null;
  setApiLoading: (loading: boolean) => void;
  setApiError: (e: Error | null) => void;
  ariaMessage: string;
  setAriaMessage: (message: string) => void;
  genreMap: GenreMap;
  watchlist: Movie[];
  setWatchlist: HandleMovies;
  toggleWatchlist: HandleMovie;
  movieResults: Movie[];
  setMovieResults: HandleMovies;
  hasSearched: boolean;
  setHasSearched: (searched: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  showcaseTabs: ShowcaseTabs;
  setShowcaseTabs: HandleShowcase;
  activeTab: TMDBMovieList;
  setActiveTab: Dispatch<SetStateAction<TMDBMovieList>>;
  activeTheme: Theme;
}

function App() {
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<Error | null>(null);
  const [ariaMessage, setAriaMessage] = useState<string>("");
  const [genreMap, setGenreMap] = useState<GenreMap>({});
  const [watchlist, setWatchlist] = useLocalStorage<Movie[]>("watchlist", []);
  const [activeTab, setActiveTab] = useState<TMDBMovieList>("popular");

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
              Watchlist ({watchlist.length > 99 ? "99+" : watchlist.length})
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
          <Outlet
            context={{
              apiLoading,
              apiError,
              setApiLoading,
              setApiError,
              ariaMessage,
              setAriaMessage,
              genreMap,
              watchlist,
              setWatchlist,
              toggleWatchlist,
              movieResults,
              setMovieResults,
              hasSearched,
              setHasSearched,
              query,
              setQuery,
              showcaseTabs,
              setShowcaseTabs,
              activeTheme,
              activeTab,
              setActiveTab,
            }}
          />
        </Row>
      </main>

      <footer className="mt-5">
        <Row>
          <Col
            md={6}
            as="p"
            className="d-flex justify-content-center justify-content-md-end align-items-center"
          >
            Site
            <i className="bi bi-c-circle px-1" aria-label="Copyright" />
            <a href="https://www.kylejackson.dev/">Kyle Jackson</a>
            <span className="ps-1">{new Date().getFullYear()}</span>.
          </Col>
          <Col
            md={6}
            as="p"
            className="d-flex justify-content-center justify-content-md-start align-items-center"
          >
            <span className="me-2">Powered by:</span>
            <a href="https://www.themoviedb.org/" target="_blank">
              <span className="visually-hidden">(Opens in new tab)</span>
              <img src={TMDB} alt="TMDB" width={60} height={32} />
            </a>
          </Col>
        </Row>
      </footer>
    </Container>
  );
}

export default App;
