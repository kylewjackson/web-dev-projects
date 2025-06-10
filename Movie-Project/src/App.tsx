import { useState } from "react";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar";
import { type Movie } from "./types/movie";
import { makeYear } from "./utils/movie";

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
  function onSearch(query: string) {
    setHasSearched(true);
    console.log("Searching for:", query);
    //Mock results
    setMovieResults([
      {
        id: "test-1",
        title: "Kill Bill Vol. 1",
        year: makeYear(2003),
        poster: "https://placehold.co/405x600",
        overview: "Test",
      },
      {
        id: "test-2",
        title: "American Beauty",
        year: makeYear(1999),
        poster: "https://placehold.co/405x600",
        overview: "Test",
      },
      {
        id: "test-3",
        title: "All About Eve",
        year: makeYear(1950),
        poster: "https://placehold.co/405x600",
        overview: "Test",
      },
    ]);
  }

  return (
    <main className="row justify-content-center">
      <section className="col-11 col-lg-6">
        <SearchBar onSearch={onSearch} query={query} setQuery={setQuery} />
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
