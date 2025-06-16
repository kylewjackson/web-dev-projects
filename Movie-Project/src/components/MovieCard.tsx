import { useState } from "react";
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
  const {
    id,
    title,
    year,
    poster,
    overview,
    rating,
    release,
    language,
    genres,
  } = movie;
  const [expanded, setExpanded] = useState(false);

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
        <div className="col-4 col-md-3">
          <img
            src={poster}
            alt={"poster for: " + title}
            className="img-fluid movie-card--rounded-top-left"
          />
        </div>
        <div className="col-8 col-md-8">
          <div className="card-body p-2 ps-0 p-md-9">
            <h2 className="card-title h4">
              {formatTitleWithYear({ title, year, variant: "card" })}
            </h2>
            <div>
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
        <button
          className="col-12 mt-2 btn btn-link text-dark-emphasis text-decoration-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse-${id}`}
          aria-expanded="false"
          aria-controls={`collapse-${id}`}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded === false ? (
            <>
              Show More <i className="bi bi-chevron-down"></i>
            </>
          ) : (
            <>
              Show Less <i className="bi bi-chevron-up"></i>
            </>
          )}
        </button>
        <div className="mt-2 collapse col-11 mx-auto row" id={`collapse-${id}`}>
          <h3 className="h5">Overview</h3>
          {genres.length > 0 && (
            <>
              <h4 className="visually-hidden">Genre</h4>
              <ul className="list-unstyled d-flex flex-wrap mb-2">
                {genres.map((genre) => (
                  <li key={`${movie.id}--${genre.id}`}>
                    <span className="me-1 badge text-bg-secondary">
                      {genre.name}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {overview && (
            <>
              <h4 className="visually-hidden">Synopsis</h4>
              <p>{overview}</p>
            </>
          )}

          {language && (
            <>
              <h4 className="h6">Language</h4>
              <p>
                {new Intl.DisplayNames(undefined, { type: "language" }).of(
                  language
                )}
              </p>
            </>
          )}
          {release && (
            <>
              <h4 className="h6">Release</h4>
              <p>{release}</p>
            </>
          )}
          {rating != null && rating > 0 && (
            <>
              <h4 className="h6">Avg. Rating</h4>
              <p>{Math.round(rating)}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
