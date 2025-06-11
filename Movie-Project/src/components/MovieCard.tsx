import { type Movie } from "../types/movie";
import { formatTitleWithYear } from "../utils/movieUtils";

type Props = {
  movie: Movie;
  watchlist: Movie[];
  onAddToWatchlist: (movie: Movie) => void;
};

export default function MovieCard({
  movie,
  watchlist,
  onAddToWatchlist,
}: Props) {
  const { title, year, poster, overview } = movie;
  const isInWatchlist = watchlist.some(
    (listMovie) => listMovie.id === movie.id
  );

  function handleAddToWatchlist() {
    onAddToWatchlist(movie);
  }

  return (
    <div className="card mb-3">
      <div className="row">
        <div className="col-5 col-md-4">
          <img
            src={poster}
            alt={"poster for: " + title}
            className="img-fluid rounded-start"
          />
        </div>
        <div className="col-7 col-md-8">
          <div className="card-body p-1 p-md-3">
            <h3 className="card-title">
              {formatTitleWithYear({ title, year, variant: "card" })}
            </h3>
            <p className="card-text truncate">{overview}</p>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={handleAddToWatchlist}
              disabled={isInWatchlist && true}
            >
              {isInWatchlist ? "In" : "Add to"} Watchlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
