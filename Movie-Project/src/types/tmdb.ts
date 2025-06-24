import type { Genre, MovieStatus } from "./movie";

export type TMDBMovieList = "popular" | "top_rated" | "upcoming";

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
  backdrop_path: string | null;
  overview: string;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  vote_average: number;
}

export type MovieDetailsApiResult = Omit<MovieApiResult, "genre_ids"> & {
  genres: Genre[];
  runtime: number;
  status: MovieStatus;
  tagline: string;
  revenue: number;
  budget: number;
  original_title: string;
  imdb_id: string;
};

export interface MovieGenresResponse {
  genres: Genre[];
}
