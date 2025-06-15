import type { Movie } from "../types/movie";

type MovieField = keyof Movie;

export const MOVIE_FIELDS: MovieField[] = [
  "id",
  "title",
  "year",
  "poster",
  "overview",
  "popularity",
  "rating",
  "release",
  "genres",
  "language",
] as const;
