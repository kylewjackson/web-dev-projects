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
        setApiError(new Error("Couldn't load movie details"));
        setAriaMessage("Something went wrong fetching movie details.");
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
        <h1>{movie.title}</h1>
      ) : hasAttemptedLoad ? (
        <h1>No Movie Found</h1>
      ) : null}
      {apiError && <ErrorMessage message={apiError.message} />}
    </article>
  );
}
