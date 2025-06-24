import { useLocation } from "react-router";
import type { Movie, HandleMovie, HandleMovies } from "../types/movie";
import useWatchlistRefresh from "../hooks/useWatchlistRefresh";
import MovieCardList from "../components/MovieCardList";
import { Col } from "react-bootstrap";

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
      <h1 className="text-center my-3">Watchlist</h1>
      <Col as="section" xs={11} lg={5}>
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
      </Col>
    </>
  );
}
