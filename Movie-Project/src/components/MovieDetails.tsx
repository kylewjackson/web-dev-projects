import { useEffect, useState, type ReactElement } from "react";
import { useParams } from "react-router";
import type {
  FullMovie,
  HandleMovie,
  Movie,
  MovieStatus,
} from "../types/movie";
import { fetchMovieDetails } from "../api/tmdb";
import { formatTitleWithYear } from "../utils/movieUtils";
import formatCurrency from "../utils/formatCurrency";
import LoadingMessage from "./common/LoadingMessage";
import ErrorMessage from "./common/ErrorMessage";
import RatingIcon from "./common/RatingIcon";
import WatchlistButton from "./WatchlistButton";
import GenreBadges from "./GenreBadges";

export type Props = {
  apiLoading: boolean;
  apiError: Error | null;
  setApiLoading: (loading: boolean) => void;
  setApiError: (error: Error | null) => void;
  setAriaMessage: (message: string) => void;
  watchlist: Movie[];
  toggleWatchlist: HandleMovie;
};

export default function MovieDetails({
  apiLoading,
  apiError,
  setApiLoading,
  setApiError,
  setAriaMessage,
  watchlist,
  toggleWatchlist,
}: Props) {
  const { id } = useParams();
  const [movie, setMovie] = useState<FullMovie | null>(null);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  useEffect(() => {
    async function loadMovie() {
      if (!Number(id)) {
        setAriaMessage(`Invalid movie id in url`);
        setHasAttemptedLoad(true);
        return;
      }

      setApiLoading(true);
      setAriaMessage(`Loading details for movie`);
      setApiError(null);
      const movieData = await fetchMovieDetails(Number(id));
      setApiLoading(false);
      setHasAttemptedLoad(true);

      if (movieData) {
        setMovie(movieData);
      } else {
        const detailErrorMsg = "Couldn't load movie details";
        // setApiError(new Error(detailErrorMsg));
        setAriaMessage(detailErrorMsg);
      }

      setApiLoading(false);
      setHasAttemptedLoad(true);
    }

    loadMovie();
  }, [id, setApiError, setApiLoading, setAriaMessage]);

  if (apiLoading) {
    return <LoadingMessage context="movie details" />;
  }

  if (!movie && hasAttemptedLoad) {
    return (
      <>
        <h1 className="mt-3 text-center">No Movie Found</h1>
        <p className="col-md-6 text-center mx-auto">
          It looks like this ID doesn't point to a single film (it might be a
          collection or an upcoming title). Try searching again or go back to
          the results.
        </p>
      </>
    );
  }

  if (!movie && apiError) {
    return <ErrorMessage message={apiError.message} />;
  }

  if (!movie) {
    return null;
  }

  const {
    title,
    original_title,
    year,
    poster,
    backdrop,
    rating,
    overview,
    genres,
    language,
    runtime,
    status,
    tagline,
    budget,
    revenue,
    imdb,
  } = movie;

  const infoBadgeClasses = "badge text-bg-light col-5 py-3";
  const statusIcon: Record<MovieStatus, ReactElement> = {
    Rumored: <i className="bi bi-question-circle pe-1" />,
    Planned: <i className="bi bi-calendar-event pe-1" />,
    "In Production": <i className="bi bi-play-circle pe-1" />,
    "Post Production": <i className="bi bi-scissors pe-1" />,
    Released: <i className="bi bi-check-circle pe-1" />,
    Canceled: <i className="bi bi-slash-circle pe-1" />,
  };
  const isInWatchlist = watchlist.some(
    (listMovie) => listMovie.id === movie.id
  );

  return (
    <article>
      <div
        className="movie-details full-viewport--1280 row justify-content-center p-3 pt-sm-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,1)), url('${backdrop}')`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="movie-details_title col-12 col-sm-10 mb-0 text-center mx-auto">
          {genres.length > 0 && (
            <GenreBadges movie={movie} genres={genres} variant="light" />
          )}
          <h1 className="p-2 text-center text-bg-light rounded-3">
            {formatTitleWithYear({
              title,
              year,
              variant: "card",
            })}
          </h1>
          <WatchlistButton
            movie={movie}
            isInWatchlist={isInWatchlist}
            toggleWatchlist={toggleWatchlist}
            outline={false}
          />
        </div>
        <div className="movie-details_poster col-9 py-4 m-auto">
          <img src={poster} alt="" className="img-fluid shadow-sm" />
        </div>
        <h2 className="visually-hidden">Overview</h2>
        <div className="movie-details_info col-12 col-sm-10 text-center row mx-auto justify-content-around p-sm-0">
          {language && (
            <p className={infoBadgeClasses}>
              <i className="bi bi-ear pe-1"></i>{" "}
              {new Intl.DisplayNames(undefined, { type: "language" }).of(
                language
              )}
            </p>
          )}
          {runtime !== null && runtime > 0 && (
            <p className={infoBadgeClasses}>
              <i className="bi bi-clock pe-1"></i> {runtime}{" "}
              {runtime > 1 ? "mins" : "min"}
            </p>
          )}
          {status && (
            <p className={infoBadgeClasses}>
              {statusIcon[status] ?? null} {status}
            </p>
          )}
          {rating != null && Math.round(rating) !== 0 && (
            <p className={infoBadgeClasses}>
              {rating && (
                <RatingIcon val={Math.round(rating)} className="pe-1" />
              )}{" "}
              Rating: {rating && Math.round(rating)}
            </p>
          )}
        </div>
      </div>
      <div className="movie-details_overview mx-xl-5">
        {imdb && (
          <a href={`https://www.imdb.com/title/${imdb}/`} target="_blank" title="Visit IMDb">
            <span className="visually-hidden">(Opens in new tab)</span>
            <span className="badge text-black" style={{backgroundColor: '#f4c434'}}>IMDb</span>
          </a>
        )}
				<a href={`https://www.letterboxd.com/tmdb/${id}/`} target="_blank" title="Visit Letterboxd">
            <span className="visually-hidden">(Opens in new tab)</span>
            <span className="badge text-bg-dark">Letterboxd</span>
          </a>
        {original_title && (
          <p className="text-secondary">Original Title: {original_title}</p>
        )}
        {tagline && <p className="fst-italic">{tagline}</p>}
        <p>{overview}</p>
        {budget != null && budget > 0 && (
          <p>Budget: {formatCurrency(budget)}</p>
        )}
        {revenue != null && revenue > 0 && (
          <p
            className={
              budget
                ? revenue > budget
                  ? "text-success"
                  : "text-danger"
                : undefined
            }
          >
            Revenue: {formatCurrency(revenue)}
          </p>
        )}
      </div>
    </article>
  );
}
