import { useCallback, useEffect, useRef, useState } from "react";
import { fetchMoviesShowcase } from "../api/tmdb";
import type {
  GenreMap,
  HandleMovie,
  HandleShowcase,
  Movie,
  ShowcaseTabs,
} from "../types/movie";
import type { TMDBMovieList } from "../types/tmdb";
import ErrorMessage from "./common/ErrorMessage";
import LoadingMessage from "./common/LoadingMessage";
import MovieCardList from "./MovieCardList";

type Props = {
  apiError: Error | null;
  watchlist: Movie[];
  toggleWatchlist: HandleMovie;
  genreMap: GenreMap;
  locationPathName: string;
  setApiError: (error: Error | null) => void;
  setAriaMessage: (message: string) => void;
  showcaseTabs: ShowcaseTabs;
  setShowcaseTabs: HandleShowcase;
};

export default function Showcase({
  apiError,
  watchlist,
  toggleWatchlist,
  genreMap,
  locationPathName,
  setApiError,
  setAriaMessage,
  showcaseTabs,
  setShowcaseTabs,
}: Props) {
  const loadedTabs = useRef<Set<TMDBMovieList>>(new Set());
  const [localLoading, setLocalLoading] = useState(false);

  //Fetch Tab Data
  const onShowcaseFetch = useCallback(
    async (listType: TMDBMovieList) => {
      if (loadedTabs.current.has(listType)) return;

      setLocalLoading(true);
      setAriaMessage(`Loading results for ${listType}`);
      setApiError(null);

      try {
        const movies = await fetchMoviesShowcase(listType, genreMap);
        setShowcaseTabs((prev) => ({ ...prev, [listType]: movies ?? [] }));
        loadedTabs.current.add(listType);
      } catch {
        setShowcaseTabs((prev) => ({ ...prev, [listType]: [] }));
        const errMsg = "Something went wrong fetching showcase.";
        setApiError(new Error(errMsg));
        setAriaMessage(errMsg);
      } finally {
        setLocalLoading(false);
      }
    },
    [genreMap, setApiError, setAriaMessage, setShowcaseTabs]
  );

  useEffect(() => {
    // fetch initial popular results
    void onShowcaseFetch("popular");
  }, [onShowcaseFetch]);

  return (
    <>
      <h2 className="text-center mb-4">Showcase</h2>
      <ul className="nav nav-tabs justify-content-center" id="showcase" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="text-body nav-link active"
            id="popular"
            data-bs-toggle="tab"
            data-bs-target="#popular-pane"
            type="button"
            role="tab"
            aria-controls="popular-pane"
            aria-selected="true"
          >
            Popular
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="text-body nav-link"
            id="top-rated-tab"
            data-bs-toggle="tab"
            data-bs-target="#top-rated-tab-pane"
            type="button"
            role="tab"
            aria-controls="top-rated-tab-pane"
            aria-selected="false"
            onClick={() => onShowcaseFetch("top_rated")}
          >
            Top Rated
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="text-body nav-link"
            id="upcoming-tab"
            data-bs-toggle="tab"
            data-bs-target="#upcoming-tab-pane"
            type="button"
            role="tab"
            aria-controls="upcoming-tab-pane"
            aria-selected="false"
            onClick={() => onShowcaseFetch("upcoming")}
          >
            Upcoming
          </button>
        </li>
      </ul>
      <div className="mt-3 tab-content" id="showcaseTabContent" style={{minHeight: 'calc(100vh - 250px)'}}>
        <div
          className="tab-pane fade show active"
          id="popular-pane"
          role="tabpanel"
          aria-labelledby="popular"
          tabIndex={0}
        >
          {localLoading && <LoadingMessage context={"popular movies"} />}
          {apiError && <ErrorMessage message={apiError.message} />}
          <MovieCardList
            movies={showcaseTabs["popular"]}
            watchlist={watchlist}
            toggleWatchlist={toggleWatchlist}
            locationPathName={locationPathName}
            context={"showcase-popular"}
          />
        </div>
        <div
          className="tab-pane fade"
          id="top-rated-tab-pane"
          role="tabpanel"
          aria-labelledby="top-rated-tab"
          tabIndex={0}
        >
          {localLoading && <LoadingMessage context={"top rated movies"} />}
          {apiError && <ErrorMessage message={apiError.message} />}
          <MovieCardList
            movies={showcaseTabs["top_rated"]}
            watchlist={watchlist}
            toggleWatchlist={toggleWatchlist}
            locationPathName={locationPathName}
            context={"showcase-top_rated"}
          />
        </div>
        <div
          className="tab-pane fade"
          id="upcoming-tab-pane"
          role="tabpanel"
          aria-labelledby="upcoming-tab"
          tabIndex={0}
        >
          {localLoading && <LoadingMessage context={"upcoming movies"} />}
          {apiError && <ErrorMessage message={apiError.message} />}
          <MovieCardList
            movies={showcaseTabs["upcoming"]}
            watchlist={watchlist}
            toggleWatchlist={toggleWatchlist}
            locationPathName={locationPathName}
            context={"showcase-upcoming"}
          />
        </div>
      </div>
    </>
  );
}
