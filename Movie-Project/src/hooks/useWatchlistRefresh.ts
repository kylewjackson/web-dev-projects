import { useEffect } from "react";
import { MOVIE_FIELDS, type MovieField } from "../constants/movieFields";
import type { ISODateString, Movie } from "../types/movie";
import { fetchMovieDetails } from "../api/tmdb";

const REQUIRED_FIELDS = MOVIE_FIELDS.filter(
  (field): field is Exclude<MovieField, "id"> => field !== "id"
);

function needsRefresh(local: Movie, remote: Movie): boolean {
  return REQUIRED_FIELDS.some((field) => local[field] !== remote[field]);
}

function isStale(movie: Movie): boolean {
  if (!movie.lastUpdated) return true;
  const last = new Date(movie.lastUpdated as string).getTime();
  return Date.now() - last > 24 * 60 * 60 * 1000; // older than 24 hours
}

export default function useWatchlistRefresh(
  watchlist: Movie[],
  setWatchlist: (movies: Movie[]) => void
) {
  useEffect(() => {
    if (!watchlist || watchlist.length === 0) return;

    const staleMovies = watchlist.filter(isStale);
    if (staleMovies.length === 0) {
      return;
    }

    (async () => {
      const refreshedList: Movie[] = [];
      for (const movie of watchlist) {
        if (!isStale(movie)) {
          refreshedList.push(movie);
          continue;
        }
        try {
          const freshMovie = await fetchMovieDetails(Number(movie.id));
          if (freshMovie) {
            if (needsRefresh(movie, freshMovie) || !movie.lastUpdated) {
              refreshedList.push({
                ...freshMovie,
                lastUpdated: new Date().toISOString() as ISODateString,
              });
              continue;
            }
          }
          // update lastUpdated to mark refresh attempted
          refreshedList.push({
            ...movie,
            lastUpdated: new Date().toISOString() as ISODateString,
          });
        } catch (err) {
          console.warn(`Failed to fetch movie ID ${movie.id}`, err);
          // update lastUpdated to mark refresh attempted
          refreshedList.push({
            ...movie,
            lastUpdated: new Date().toISOString() as ISODateString,
          });
        }
      }

      // update if refreshed list differs from the original
      if (refreshedList.some((movie, i) => movie !== watchlist[i])) {
        setWatchlist(refreshedList);
      }
    })();
  }, [watchlist, setWatchlist]);
}
