import MovieCard from "../components/MovieCard";
import type { Movie, HandleMovie, HandleMovies } from "../types/movie";
import useWatchlistRefresh from "../hooks/useWatchlistRefresh";

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

  return (
    <>
      <h1 className="visually-hidden">Your Watchlist</h1>
      <section className="col-11 col-lg-6 pt-3">
        {watchlist.length > 0 ? (
          <ul className="list-unstyled">
            {watchlist.map((movie) => (
              <li key={movie.id}>
                <MovieCard
                  movie={movie}
                  watchlist={watchlist}
                  toggleWatchlist={toggleWatchlist}
									outline={true}
                />
              </li>
            ))}
          </ul>
        ) : (
          <h2 className="h4 text-center">Nothing in watchlist</h2>
        )}
      </section>
    </>
  );
}
