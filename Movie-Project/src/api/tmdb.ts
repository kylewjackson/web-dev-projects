import type { Movie } from "../types/movie";
import type { MovieApiResponse, MovieApiResult } from "../types/tmdb";
import { makeYear } from "../utils/movie";

export function mapMovieResultToMovie(result: MovieApiResult): Movie {
  return {
    id: result.id.toString(),
    title: result.title,
    poster: result.poster_path
      ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
      : "https://placehold.co/500x750",
    year: makeYear(result.release_date),
    overview: result.overview,
  };
}

export async function fetchMovies(query: string): Promise<Movie[]> {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
    query
  )}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json: MovieApiResponse = await response.json();
    console.log(json); //Remove after testing
    return json.results.map(mapMovieResultToMovie);
  } catch (error) {
    console.error(error);
    return [];
  }
}
