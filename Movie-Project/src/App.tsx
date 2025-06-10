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
};

function Main({ apiLoading, setApiLoading, apiError, setApiError }: Props) {
  const [movieResults, setMovieResults] = useState<Movie[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [query, setQuery] = useState<string>("");

  //Communicate with SearchBar
  async function onSearch(query: string) {
    setHasSearched(true);
    setApiLoading(true);
    setApiError(null);
    try {
      const movies = await fetchMovies(query);
      setMovieResults(movies);
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error);
        console.log(error);
      }
      setMovieResults([]);
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
        <SearchBar onSearch={onSearch} query={query} setQuery={setQuery} />
        {apiLoading && <div>Loading...</div>}
        {apiError && (
          <div className="alert alert-danger">
            Something went wrong: {apiError.message}
          </div>
        )}
        {movieResults.length > 0 ? (
          <ul className="list-unstyled">
            {movieResults.map((movie) => (
              <li key={movie.id}>
                <MovieCard movie={movie} />
              </li>
            ))}
          </ul>
        ) : (
          hasSearched && <p>No results</p>
        )}
      </section>
    </main>
  );
}

function App() {
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<Error | null>(null);

  return (
    <div className="container py-4">
      <header className="text-center mb-2">
        <h1>Movie Watchlist</h1>
      </header>
      <Main
        apiLoading={apiLoading}
        apiError={apiError}
        setApiLoading={setApiLoading}
        setApiError={setApiError}
      />
    </div>
  );
}

export default App;
