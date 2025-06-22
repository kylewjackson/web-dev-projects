import { useLocation } from "react-router";
import type { Movie, HandleMovie, HandleMovies } from "../types/movie";
import useWatchlistRefresh from "../hooks/useWatchlistRefresh";
import MovieCardList from "../components/MovieCardList";

type Props = {
  watchlist: Movie[];
  setWatchlist: HandleMovies;
  toggleWatchlist: HandleMovie;
};

export default function WatchlistView({
  watchlist,
  setWatchlist,
  toggleWatchlist,
}: Props) {
  useWatchlistRefresh(watchlist, setWatchlist);
  const location = useLocation();

  return (
    <>
      <h1 className="visually-hidden">Your Watchlist</h1>
      <section className="col-11 col-lg-5 pt-3">
        {watchlist.length > 0 ? (
          <MovieCardList
            movies={watchlist}
            watchlist={watchlist}
            toggleWatchlist={toggleWatchlist}
            locationPathName={location.pathname}
          />
        ) : (
          <h2 className="h4 text-center">Nothing in watchlist</h2>
        )}
      </section>
    </>
  );
}
