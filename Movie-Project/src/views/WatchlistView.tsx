import MovieCard from "../components/MovieCard";
import type { Movie } from "../types/movie";

type Props = {
  watchlist: Movie[];
  setWatchlist: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export default function WatchlistView({ watchlist, setWatchlist }: Props) {
  function onRemoveFromWatchlist(movie: Movie) {
    setWatchlist(watchlist.filter((listMovie) => listMovie.id !== movie.id)
    );
  }
  return (
    <main className="row justify-content-center">
      <section className="col-11 col-lg-6">
        {watchlist.length > 0 ? (
          <ul className="list-unstyled">
            {watchlist.map((movie) => (
              <li key={movie.id}>
                <MovieCard
                  movie={movie}
                  watchlist={watchlist}
                  onRemoveFromWatchlist={onRemoveFromWatchlist}
                />
              </li>
            ))}
          </ul>
        ) : (
          <h2 className="h4 text-center">Nothing in watchlist</h2>
        )}
      </section>
    </main>
  );
}
