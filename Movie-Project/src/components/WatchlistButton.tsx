import type { HandleMovie, Movie } from "../types/movie";

type Props = {
  movie: Movie;
  isInWatchlist: boolean;
  toggleWatchlist: HandleMovie;
	outline?: boolean
};

export default function WatchlistButton({
  movie,
  isInWatchlist,
  toggleWatchlist,
	outline = false,
}: Props) {

  return (
    <button
      type="button"
      className={`btn btn-sm${!isInWatchlist ? " shadow-sm" : ""} ${
        !isInWatchlist ? `btn-${outline ? 'outline-' : ''}dark` : `btn-${outline ? 'outline-' : ''}danger`
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
