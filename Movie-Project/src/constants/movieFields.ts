import type { Movie } from "../types/movie";

export type MovieField = keyof Movie;

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

export const EXTENDED_MOVIE_FIELDS = [
  "backdrop",
  "runtime",
  "tagline",
] as const;

export const CREDIT_MOVIE_FIELDS = [] as const;
