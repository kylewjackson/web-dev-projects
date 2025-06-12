import { type Movie } from "../types/movie";
import { formatTitleWithYear } from "../utils/movieUtils";

type Props = {
  movie: Movie;
  watchlist: Movie[];
  onAddToWatchlist?: (movie: Movie) => void;
  onRemoveFromWatchlist?: (movie: Movie) => void;
  isInWatchlist?: boolean;
};

export default function MovieCard({
  movie,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  isInWatchlist,
}: Props) {
  const { title, year, poster, overview } = movie;

  function handleAddToWatchlist() {
    if (onAddToWatchlist) {
      onAddToWatchlist(movie);
    } else if (onRemoveFromWatchlist) {
      onRemoveFromWatchlist(movie);
    }
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
              className={`btn btn-sm ${
                onAddToWatchlist ? "btn-outline-primary" : "btn-danger"
              }`}
              onClick={handleAddToWatchlist}
              disabled={onAddToWatchlist && isInWatchlist && true}
            >
              {onAddToWatchlist
                ? `${isInWatchlist ? "In" : "Add to"} Watchlist`
                : "Remove From Watchlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
