import { useState } from "react";
import type { Movie, HandleMovie } from "../types/movie";
import { formatTitleWithYear } from "../utils/movieUtils";
import { NavLink } from "react-router";
import slugify from "slugify";
import WatchlistButton from "./WatchlistButton";
import GenreBadges from "./GenreBadges";
import formatLanguage from "../utils/formatLanguage";

type Props = {
  movie: Movie;
  watchlist: Movie[];
  toggleWatchlist: HandleMovie;
  outline?: boolean;
  from: string;
  context?: string;
};

export default function MovieCard({
  movie,
  watchlist,
  toggleWatchlist,
  outline,
  from,
  context,
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
  const slug = slugify(title, "+");
  const isInWatchlist = watchlist.some(
    (listMovie) => listMovie.id === movie.id
  );

  return (
    <div className="card mb-3">
      <div className="row">
        <div className="col-4 col-md-3">
          <img
            src={poster}
            alt={"poster for: " + title}
            className="img-fluid movie-card--rounded-top-left shadow-sm"
          />
        </div>
        <div className="col-8 col-md-9 ps-0 ps-md-2">
          <div className="card-body p-2 ps-0 p-md-9">
            <h2 className="card-title h4">
              {formatTitleWithYear({ title, year, variant: "card" })}
            </h2>
            <div className="d-flex flex-column align-items-start">
              <NavLink
                to={`/movie/${id}/${slug}`}
                state={{ from }}
                className="btn btn-link ps-0 me-2 mb-2"
                style={
                  {
                    "--bs-btn-color": "var(--bs-dark-text)",
                    "--bs-btn-hover-color": "var(--bs-dark-text-emphasis)",
                  } as React.CSSProperties
                }
              >
                <span>
                  Full Details
                  <i className="ps-1 bi bi-arrow-right-circle" />
                </span>
              </NavLink>
              <WatchlistButton
                movie={movie}
                isInWatchlist={isInWatchlist}
                toggleWatchlist={toggleWatchlist}
                outline={outline}
              />
            </div>
          </div>
        </div>
        <button
          className="col-12 mt-2 btn btn-link text-dark-emphasis text-decoration-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse-${context ? `${context}-` : ""}${id}`}
          aria-expanded="false"
          aria-controls={`collapse-${context ? `${context}-` : ""}${id}`}
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
        <div
          className="mt-2 collapse col-11 mx-auto row"
          id={`collapse-${context ? `${context}-` : ""}${id}`}
        >
          <h3 className="h5">Overview</h3>
          {genres.length > 0 && (
            <>
              <h4 className="visually-hidden">Genre</h4>
              <GenreBadges movie={movie} genres={genres} />
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
              <p>{formatLanguage(language)}</p>
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
