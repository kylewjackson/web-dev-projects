import { useEffect, useState } from "react";
import type { Movie } from "../types/movie";
import { fetchMovieDetails } from "../api/tmdb";
import LoadingMessage from "./common/LoadingMessage";
import ErrorMessage from "./common/ErrorMessage";

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
  const [movie, setMovie] = useState<Movie | null>(null);
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

  return (
    <article>
      {apiLoading ? (
        <LoadingMessage context="movie details" />
      ) : movie ? (
        <>
          <div
            className="full-viewport--1280 row p-3"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,1)), url('${movie.backdrop}')`,
              backgroundSize: "contain",
            }}
          >
            <div className="col-8 text-center my-auto">
              <h1 className="text-bg-light">{movie.title}</h1>
              <p className="text-bg-light">Language: {movie.language}</p>
              <p className="text-bg-light">Avg. Rating: {movie.rating}</p>
            </div>
            <div className="col-4">
              <img
                src={`${movie.poster}`}
                alt=""
                className="img-fluid shadow"
              />
            </div>
          </div>
          <div className="mx-xl-2">
            <p>{movie.overview}</p>
          </div>
        </>
      ) : hasAttemptedLoad ? (
        <h1>No Movie Found</h1>
      ) : null}
      {apiError && <ErrorMessage message={apiError.message} />}
    </article>
  );
}
