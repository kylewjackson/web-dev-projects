import { useLocation } from "react-router";
import { fetchMovies } from "../api/tmdb";
import type {
  GenreMap,
  HandleMovie,
  HandleMovies,
  HandleShowcase,
  Movie,
  ShowcaseTabs,
} from "../types/movie";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import Showcase from "../components/Showcase";

type Props = {
  apiLoading: boolean;
  setApiLoading: (loading: boolean) => void;
  apiError: Error | null;
  setApiError: (error: Error | null) => void;
  setAriaMessage: (message: string) => void;
  watchlist: Movie[];
  toggleWatchlist: HandleMovie;
  genreMap: GenreMap;
  movieResults: Movie[];
  setMovieResults: HandleMovies;
  hasSearched: boolean;
  setHasSearched: (searched: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  showcaseTabs: ShowcaseTabs;
  setShowcaseTabs: HandleShowcase;
};

export default function SearchView({
  apiLoading,
  setApiLoading,
  apiError,
  setApiError,
  setAriaMessage,
  watchlist,
  toggleWatchlist,
  genreMap,
  movieResults,
  setMovieResults,
  hasSearched,
  setHasSearched,
  query,
  setQuery,
  showcaseTabs,
  setShowcaseTabs,
}: Props) {
  const location = useLocation();

  //Communicate with SearchBar
  async function onSearch(query: string) {
    setApiLoading(true);
    setAriaMessage(`Loading results for ${query}`);
    setApiError(null);
    setHasSearched(true);
    const movies = await fetchMovies(query, genreMap);

    if (movies) {
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
        <SearchResults
          apiLoading={apiLoading}
          apiError={apiError}
          watchlist={watchlist}
          toggleWatchlist={toggleWatchlist}
          movieResults={movieResults}
          hasSearched={hasSearched}
          query={query}
          locationPathName={location.pathname}
        />
      </section>
      <section className="col-12 pt-3">
        <div className="col-11 col-lg-6 mx-auto">
          <Showcase
            genreMap={genreMap}
            apiError={apiError}
            setApiError={setApiError}
            setAriaMessage={setAriaMessage}
            watchlist={watchlist}
            toggleWatchlist={toggleWatchlist}
            locationPathName={location.pathname}
            showcaseTabs={showcaseTabs}
            setShowcaseTabs={setShowcaseTabs}
          />
        </div>
      </section>
    </>
  );
}
