import "./App.css";
import { useState } from "react";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar";
import { type Movie } from "./types/movie";
import { fetchMovies } from "./api/tmdb";

type Props = {
  apiLoading: boolean;
  setApiLoading: (loading: boolean) => void;
  apiError: Error | null;
  setApiError: (error: Error | null) => void;
  setAriaMessage: (message: string) => void;
};

function Main({
  apiLoading,
  setApiLoading,
  apiError,
  setApiError,
  setAriaMessage,
}: Props) {
  const [movieResults, setMovieResults] = useState<Movie[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [query, setQuery] = useState<string>("");

  //Communicate with SearchBar
  async function onSearch(query: string) {
    setApiLoading(true);
    setAriaMessage(`Loading results for ${query}`);
    setApiError(null);
    setHasSearched(true);
    try {
      const movies = await fetchMovies(query);
      setMovieResults(movies);
      if (movies.length > 0) {
        setAriaMessage(
          `Found ${movies.length} result${
            movies.length === 1 ? "" : "s"
          } for ${query}`
        );
      } else {
        setAriaMessage(
          `No results found for ${query}. Please try a new search.`
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error);
        console.log(error);
      }
      setMovieResults([]);
      setAriaMessage("Something went wrong. Please try a new search.");
    } finally {
      setApiLoading(false);
    }
  }

  // useEffect(() => {
  //   if (hasSearched && query !== "") {
  //     console.log("Query change: " + query);
  // 		fetchMovies(query);
  //   }
  // }, [query, hasSearched]);

  return (
    <main className="row justify-content-center">
      <section className="col-11 col-lg-6">
        <SearchBar
          onSearch={onSearch}
          query={query}
          setQuery={setQuery}
          apiLoading={apiLoading}
          setHasSearched={setHasSearched}
        />
        {apiLoading && (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading results...</span>
            </div>
          </div>
        )}
        {apiError && (
          <div className="alert alert-danger">
            Something went wrong: {apiError.message}
          </div>
        )}
        {movieResults.length > 0 ? (
          <>
            <div className="alert alert-info">
              {movieResults.length} result{movieResults.length > 1 && "s"} found
            </div>
            <ul className="list-unstyled">
              {movieResults.map((movie) => (
                <li key={movie.id}>
                  <MovieCard movie={movie} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          movieResults.length === 0 &&
          hasSearched &&
          !apiLoading && (
            <p className="alert alert-warning text-center">
              No results found for {query}. Please try a new search.
            </p>
          )
        )}
      </section>
    </main>
  );
}

function App() {
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<Error | null>(null);
  const [ariaMessage, setAriaMessage] = useState<string>("");

  return (
    <div className="container py-4">
      {/* aria-live annoucment message for state changes */}
      <div id="announce" aria-live="polite" className="visually-hidden">
        <p>{ariaMessage}</p>
      </div>
      <header className="text-center mb-2">
        <h1>Movie Watchlist</h1>
      </header>
      <Main
        apiLoading={apiLoading}
        apiError={apiError}
        setApiLoading={setApiLoading}
        setApiError={setApiError}
        setAriaMessage={setAriaMessage}
      />
    </div>
  );
}

export default App;
