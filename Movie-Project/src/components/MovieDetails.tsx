import { useEffect, useState } from "react";
import type { FullMovie } from "../types/movie";
import { fetchMovieDetails } from "../api/tmdb";
import LoadingMessage from "./common/LoadingMessage";
import ErrorMessage from "./common/ErrorMessage";
import { formatTitleWithYear } from "../utils/movieUtils";

type Props = {
  apiLoading: boolean;
  apiError: Error | null;
  setApiLoading: (loading: boolean) => void;
  setApiError: (error: Error | null) => void;
  setAriaMessage: (message: string) => void;
};

export default function MovieDetails({
  apiLoading,
  apiError,
  setApiLoading,
  setApiError,
  setAriaMessage,
}: Props) {
  const [movie, setMovie] = useState<FullMovie | null>(null);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  useEffect(() => {
    async function loadMovie() {
      setApiLoading(true);
      setAriaMessage(`Loading details for movie`);
      setApiError(null);
      const movieData = await fetchMovieDetails(9323);
      setApiLoading(false);
      setHasAttemptedLoad(true);

      if (movieData) {
        setMovie(movieData);
      } else {
        const detailErrorMsg = "Couldn't load movie details";
        setApiError(new Error(detailErrorMsg));
        setAriaMessage(detailErrorMsg);
      }

      setApiLoading(false);
      setHasAttemptedLoad(true);
    }

    loadMovie();
  }, [setApiError, setApiLoading, setAriaMessage]);

  if (apiLoading) {
    return <LoadingMessage context="movie details" />;
  }

  if (!movie && hasAttemptedLoad) {
    return <h1>No Movie Found</h1>;
  }

  if (!movie && apiError) {
    return <ErrorMessage message={apiError.message} />;
  }

  if (!movie) {
    return null;
  }

  const {
    title,
    year,
    poster,
    backdrop,
    rating,
    overview,
    language,
    runtime,
    status,
    tagline,
  } = movie;

  return (
    <article>
      <div
        className="movie-details full-viewport--1280 row justify-content-center p-3"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,1)), url('${backdrop}')`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h1 className="movie-details_title col-12 col-sm-10 p-2 mb-0 mx-auto text-center text-bg-light">
          {formatTitleWithYear({
            title,
            year,
            variant: "card",
          })}
        </h1>
        <div className="movie-details_poster col-9 py-3 m-auto">
          <img src={poster} alt="" className="img-fluid shadow-sm" />
        </div>
        <h2 className="visually-hidden">Overview</h2>
        <div className="movie-details_info col-12 col-sm-10 text-center row mx-auto justify-content-around p-sm-0">
          {language && (
            <p className="text-bg-light col-5">
              <i className="bi bi-ear" aria-label="language"></i>{" "}
              {new Intl.DisplayNames(undefined, { type: "language" }).of(
                language
              )}
            </p>
          )}
          {runtime && (
            <p className="text-bg-light col-5">
              <i className="bi bi-clock" aria-label="runtime"></i> {runtime}{" "}
              {runtime > 1 ? "mins" : "min"}
            </p>
          )}
          <p className="text-bg-light col-5">Status: {status}</p>
          <p className="text-bg-light col-5">Avg. Rating: {rating}</p>
        </div>
      </div>
      <div className="movie-details_overview mx-xl-5">
        {tagline && <p className="fst-italic">{tagline}</p>}
        <p>{overview}</p>
      </div>
    </article>
  );
}
