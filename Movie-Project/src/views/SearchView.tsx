import { useLocation, useOutletContext } from "react-router";
import { Col } from "react-bootstrap";
import type { AppContextType } from "../App";
import { fetchMovies } from "../api/tmdb";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import Showcase from "../components/Showcase";

export default function SearchView() {
  const {
    apiLoading,
    apiError,
    setApiLoading,
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
    activeTab,
    setActiveTab,
		clearSearch
  } = useOutletContext<AppContextType>();
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
      <Col as="section" xs={11} lg={5} className="pt-3">
        <SearchBar
          onSearch={onSearch}
          query={query}
          setQuery={setQuery}
          apiLoading={apiLoading}
					hasSearched={hasSearched}
          setHasSearched={setHasSearched}
          setMovieResults={setMovieResults}
					clearSearch={clearSearch}
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
      </Col>
      <Col as="section" xs={12} className="pt-3 bg-body-tertiary">
        <Col xs={11} lg={5} className="mx-auto">
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
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </Col>
      </Col>
    </>
  );
}
