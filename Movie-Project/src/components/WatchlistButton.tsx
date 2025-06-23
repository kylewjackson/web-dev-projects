import type { HandleMovie, Movie } from "../types/movie";
import { Button } from "react-bootstrap";

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
  // determine the correct Bootstrap variant
  const btnVariant = isInWatchlist
    ? outline
      ? "outline-danger"
      : "danger"
    : outline
    ? `outline-${variant}`
    : variant;

  return (
    <Button
      variant={btnVariant}
      size="sm"
      className={!isInWatchlist ? "shadow-sm" : ""}
      onClick={() => toggleWatchlist(movie)}
    >
      {!isInWatchlist ? (
        <>
          Add to Watchlist <i className="bi bi-bookmark-plus" />
        </>
      ) : (
        <>
          Remove from Watchlist <i className="bi bi-bookmark-x" />
        </>
      )}
    </Button>
  );
}
