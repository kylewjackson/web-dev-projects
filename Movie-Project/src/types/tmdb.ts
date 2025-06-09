import { makeYear, type Movie } from "./movie";

export interface MovieApiResponse {
  page: number;
  results: MovieApiResult[];
  total_pages: number;
  total_results: number;
}

export interface MovieApiResult {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  overview: string;
}

export function mapMovieResultToMovie(result: MovieApiResult): Movie {
  return {
    id: result.id.toString(),
    title: result.title,
    poster: result.poster_path
      ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
      : "https://placehold.co/500x750",
    year: makeYear(result.release_date),
  };
}
