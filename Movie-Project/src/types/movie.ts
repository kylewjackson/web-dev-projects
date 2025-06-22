import type { TMDBMovieList } from "./tmdb";

//Title + Year format for various contexts
export type FormatTitleOptions = {
  title: string;
  year: Year;
  variant?: "card" | "raw";
};

export type Year = (number & { __brand: "Year" }) | null;
export type ISODateString = string & { __brand: "ISODateString" };

export interface Genre {
  id: number;
  name: string;
}

export type GenreMap = Record<number, string>;

export type Movie = {
  id: string;
  title: string;
  year: Year | null;
  poster: string;
  backdrop: string | null;
  overview: string | null;
  popularity: number | null;
  rating: number | null;
  language: string | null;
  release: string | null;
  genres: Genre[];
  lastUpdated?: ISODateString;
};

export type MovieDetails = {
  runtime: number | null;
  status: MovieStatus | null;
  tagline: string | null;
  budget: number | null;
  revenue: number | null;
  original_title: string | null;
  imdb: string;
};

export type FullMovie = Movie & MovieDetails;

export type HandleMovie = (movie: Movie) => void;
export type HandleMovies = React.Dispatch<React.SetStateAction<Movie[]>>;
export type HandleShowcase = React.Dispatch<React.SetStateAction<ShowcaseTabs>>;

export type MovieStatus =
  | "Rumored"
  | "Planned"
  | "In Production"
  | "Post Production"
  | "Released"
  | "Canceled";

export type RatingIconEntry = {
  threshold: number;
  iconClass: string;
  ariaLabel: string;
};

export type ShowcaseTabs = Record<TMDBMovieList, Movie[]>;
