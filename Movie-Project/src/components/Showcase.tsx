import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { fetchMoviesShowcase } from "../api/tmdb";
import type {
  GenreMap,
  HandleMovie,
  HandleShowcase,
  Movie,
  ShowcaseTabs,
} from "../types/movie";
import type { TMDBMovieList } from "../types/tmdb";
import { Tabs, Tab } from "react-bootstrap";
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
  activeTab: TMDBMovieList;
  setActiveTab: Dispatch<SetStateAction<TMDBMovieList>>;
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
  activeTab,
  setActiveTab,
}: Props) {
  const loadedTabs = useRef<Set<TMDBMovieList>>(new Set());
  const [localLoading, setLocalLoading] = useState(false);

  // Fetch Tab Data
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
				setAriaMessage("Results loaded.");
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

  // initial load
  useEffect(() => {
    void onShowcaseFetch("popular");
  }, [onShowcaseFetch]);

  return (
    <>
      <h2 className="text-center mb-4">Showcase</h2>

      {/* wrap Tabs in a div for mt-3 + minHeight */}
      <div className="mt-3" style={{ minHeight: "calc(100vh - 250px)" }}>
        <Tabs
          id="showcase"
          activeKey={activeTab}
          onSelect={(k) => {
            const key = k as TMDBMovieList;
            setActiveTab(key);
            onShowcaseFetch(key);
          }}
          className="justify-content-center mb-3"
          mountOnEnter
        >
          <Tab
            eventKey="popular"
            title={<span className="text-body">Popular</span>}
          >
            {localLoading && activeTab === "popular" && (
              <LoadingMessage context="popular movies" />
            )}
            {apiError && <ErrorMessage message={apiError.message} />}
            <MovieCardList
              movies={showcaseTabs.popular}
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
              locationPathName={locationPathName}
              context="showcase-popular"
            />
          </Tab>

          <Tab
            eventKey="top_rated"
            title={<span className="text-body">Top Rated</span>}
          >
            {localLoading && activeTab === "top_rated" && (
              <LoadingMessage context="top rated movies" />
            )}
            {apiError && <ErrorMessage message={apiError.message} />}
            <MovieCardList
              movies={showcaseTabs.top_rated}
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
              locationPathName={locationPathName}
              context="showcase-top_rated"
            />
          </Tab>

          <Tab
            eventKey="upcoming"
            title={<span className="text-body">Upcoming</span>}
          >
            {localLoading && activeTab === "upcoming" && (
              <LoadingMessage context="upcoming movies" />
            )}
            {apiError && <ErrorMessage message={apiError.message} />}
            <MovieCardList
              movies={showcaseTabs.upcoming}
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
              locationPathName={locationPathName}
              context="showcase-upcoming"
            />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
