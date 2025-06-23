import { useEffect, useState, type ReactElement } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
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
import { Button, Col, Row } from "react-bootstrap";
import type { Theme } from "../types/preferences";

export type Props = {
  apiLoading: boolean;
  apiError: Error | null;
  setApiLoading: (loading: boolean) => void;
  setApiError: (error: Error | null) => void;
  setAriaMessage: (message: string) => void;
  watchlist: Movie[];
  toggleWatchlist: HandleMovie;
  activeTheme: Theme;
};
interface LocationState {
  from?: string;
}

export default function MovieDetails({
  apiLoading,
  apiError,
  setApiLoading,
  setApiError,
  setAriaMessage,
  watchlist,
  toggleWatchlist,
  activeTheme,
}: Props) {
  const { id } = useParams();
  const [movie, setMovie] = useState<FullMovie | null>(null);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = (location.state as LocationState) || {};

  function handleGoBack() {
    if (from) {
      navigate(from);
    } else {
      navigate("/search");
    }
  }

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
    release,
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

  const backgroundImage =
    activeTheme === "dark"
      ? `linear-gradient(rgba(33, 37, 41,0.2) 10%, rgba(33, 37, 41,0.8) 85%, rgba(33, 37, 41,1) 98%, rgba(33, 37, 41,1) 100%), url('${backdrop}')`
      : `linear-gradient(rgba(255,255,255,0.2) 10%, rgba(255,255,255,0.8) 85%, rgba(255,255,255,1) 98%,rgba(255,255,255,1) 100%), url('${backdrop}')`;

  return (
    <article>
      <Row
        as="section"
        className="movie-details full-viewport--1280 justify-content-center p-3 pt-sm-0 position-relative"
        style={{
          backgroundImage: backgroundImage,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Col
          xs={12}
          sm={10}
          className="movie-details_title mb-0 mx-auto mt-4 mt-sm-5 mt-lg-0 pb-1 text-center"
        >
          <Button
            size="sm"
            variant="light"
            className="position-absolute top-0 start-0 m-2 py-0"
            onClick={handleGoBack}
          >
            <i className="bi bi-arrow-left-short" />
            <span>Go Back</span>
          </Button>
          {genres.length > 0 && (
            <GenreBadges movie={movie} genres={genres} variant="light" />
          )}
          <h1 className="p-2 text-center text-bg-light rounded-3">
            {formatTitleWithYear({
              title,
              year,
              variant: "card",
              bg: "light",
            })}
          </h1>
          <WatchlistButton
            movie={movie}
            isInWatchlist={isInWatchlist}
            toggleWatchlist={toggleWatchlist}
            variant={"primary"}
          />
        </Col>

        <Col xs={9} className="movie-details_poster py-4 m-auto">
          <img src={poster} alt="" className="img-fluid shadow-sm" />
        </Col>

        <h2 className="visually-hidden">Additional Details</h2>
        <Col xs={12} sm={10} className="movie-details_info text-center mx-auto">
          <Row className="justify-content-around">
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
          </Row>
        </Col>
      </Row>

      <section className="movie-details_overview full-viewport--1280 mx-lg-auto px-4">
        <h3 className="visually-hidden">External Sites</h3>
        <Row as="ul" className="list-unstyled row-cols-auto gx-2">
          {imdb && (
            <Col as="li">
              <a
                href={`https://www.imdb.com/title/${imdb}/`}
                target="_blank"
                title="Visit IMDb"
              >
                <span className="visually-hidden">(Opens in new tab)</span>
                <span
                  className="badge text-black"
                  style={{ backgroundColor: "#f4c434" }}
                >
                  IMDb
                  <i className="ps-1 bi bi-arrow-up-right-circle" />
                </span>
              </a>
            </Col>
          )}
          <Col as="li">
            <a
              href={`https://www.letterboxd.com/tmdb/${id}/`}
              target="_blank"
              title="Visit Letterboxd"
            >
              <span className="visually-hidden">(Opens in new tab)</span>
              <span className="badge text-bg-dark">
                Letterboxd <i className="ps-1 bi bi-arrow-up-right-circle" />
              </span>
            </a>
          </Col>
        </Row>

        <h3 className="visually-hidden">Movie Overview</h3>
        {original_title && (
          <p className="text-secondary">Original Title: {original_title}</p>
        )}
        {tagline && <p className="fst-italic">{tagline}</p>}
        <p>{overview}</p>

        {release && (
          <>
            <h4 className="h6">Release Date</h4>
            <p>{release}</p>
          </>
        )}

        <h3 className="visually-hidden">Financials</h3>
        {budget != null && budget > 0 && (
          <>
            <h4 className="h6">Budget</h4>
            <p>{formatCurrency(budget)}</p>
          </>
        )}
        {revenue != null && revenue > 0 && (
          <>
            <h4 className="h6">Revenue</h4>
            <p
              className={
                budget
                  ? revenue > budget
                    ? "text-success"
                    : "text-danger"
                  : undefined
              }
            >
              {formatCurrency(revenue)}
            </p>
          </>
        )}
      </section>
    </article>
  );
}
