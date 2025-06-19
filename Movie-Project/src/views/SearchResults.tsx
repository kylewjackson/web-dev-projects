import { useState } from "react";
import { fetchMovies } from "../api/tmdb";
import type { GenreMap, Movie } from "../types/movie";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import LoadingMessage from "../components/common/LoadingMessage";
import ErrorMessage from "../components/common/ErrorMessage";

type Props = {
  apiLoading: boolean;
  setApiLoading: (loading: boolean) => void;
  apiError: Error | null;
  setApiError: (error: Error | null) => void;
  setAriaMessage: (message: string) => void;
  watchlist: Movie[];
  setWatchlist: React.Dispatch<React.SetStateAction<Movie[]>>;
  genreMap: GenreMap;
};

export default function SearchResults({
  apiLoading,
  setApiLoading,
  apiError,
  setApiError,
  setAriaMessage,
  watchlist,
  setWatchlist,
  genreMap,
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
    const movies = await fetchMovies(query, genreMap);

    if (movies) {
      const movies = await fetchMovies(query, genreMap);
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
    } else {
      const searchErrorMsg = "Something went wrong. Please try a new search.";
      setMovieResults([]);
      setApiError(new Error(searchErrorMsg));
      setAriaMessage(searchErrorMsg);
    }

    setApiLoading(false);
  }

  function onAddToWatchlist(movie: Movie) {
    setWatchlist((previousWatchlist) =>
      previousWatchlist.some((listMovie) => listMovie.id === movie.id)
        ? previousWatchlist
        : [movie, ...previousWatchlist]
    );
  }

  // useEffect(() => {
  //   if (hasSearched && query !== "") {
  //     console.log("Query change: " + query);
  // 		fetchMovies(query);
  //   }
  // }, [query, hasSearched]);

  return (
    <>
      <h1 className="visually-hidden">Search for Movies</h1>
      <section className="col-11 col-lg-6 pt-3">
        <SearchBar
          onSearch={onSearch}
          query={query}
          setQuery={setQuery}
          apiLoading={apiLoading}
          setHasSearched={setHasSearched}
        />
        {apiLoading && <LoadingMessage context={"results"} />}
        {apiError && <ErrorMessage message={apiError.message} />}
        {movieResults.length > 0 ? (
          <>
            <div className="alert alert-info">
              {movieResults.length} result{movieResults.length > 1 && "s"} found
            </div>
            <ul className="list-unstyled">
              {movieResults.map((movie) => (
                <li key={movie.id}>
                  <MovieCard
                    movie={movie}
                    watchlist={watchlist}
                    onAddToWatchlist={onAddToWatchlist}
                    isInWatchlist={watchlist.some(
                      (listMovie) => listMovie.id === movie.id
                    )}
                  />
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
    </>
  );
}
