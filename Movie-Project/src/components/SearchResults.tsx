import type { HandleMovie, Movie } from "../types/movie";
import LoadingMessage from "./common/LoadingMessage";
import ErrorMessage from "./common/ErrorMessage";
import MovieCardList from "./MovieCardList";

type Props = {
  apiLoading: boolean;
  apiError: Error | null;
  watchlist: Movie[];
  toggleWatchlist: HandleMovie;
  movieResults: Movie[];
  hasSearched: boolean;
  query: string;
  locationPathName: string;
};

export default function SearchResults({
  apiLoading,
  apiError,
  watchlist,
  toggleWatchlist,
  movieResults,
  hasSearched,
  query,
  locationPathName,
}: Props) {
  return (
    <>
      {apiLoading && <LoadingMessage context={"results"} />}
      {apiError && <ErrorMessage message={apiError.message} />}
      {movieResults.length > 0 ? (
        <>
          <div className="alert alert-info">
            {movieResults.length} result{movieResults.length > 1 && "s"} found
          </div>
          <MovieCardList
            movies={movieResults}
            watchlist={watchlist}
            toggleWatchlist={toggleWatchlist}
            locationPathName={locationPathName}
            context={"search-result"}
          />
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
    </>
  );
}
