import type { HandleMovie, Movie } from "../types/movie";

type Props = {
  movie: Movie;
  isInWatchlist: boolean;
  toggleWatchlist: HandleMovie;
  outline?: boolean;
  variant?: string;
};

export default function WatchlistButton({
  movie,
  isInWatchlist,
  toggleWatchlist,
  outline = false,
  variant = "secondary",
}: Props) {
  return (
    <button
      type="button"
      className={`btn btn-sm${!isInWatchlist ? " shadow-sm" : ""} ${
        !isInWatchlist
          ? `btn-${outline ? "outline-" : ""}${variant}`
          : `btn-${outline ? "outline-" : ""}danger`
      }`}
      onClick={() => toggleWatchlist(movie)}
    >
      {!isInWatchlist ? (
        <span>
          Add to Watchlist <i className="bi bi-bookmark-plus" />
        </span>
      ) : (
        <span>
          Remove from Watchlist <i className="bi bi-bookmark-x" />
        </span>
      )}
      {/* <span>
        In Watchlist <i className="bi bi-bookmark-fill" />
      </span> */}
    </button>
  );
}
