import type { Genre } from "./movie";

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
  genre_ids: number[];
  original_language: string;
  popularity: number;
  vote_average: number;
}

export interface MovieGenresResponse {
  genres: Genre[];
}
