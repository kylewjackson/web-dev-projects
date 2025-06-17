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

export type FullMovie = Movie & {
  director: string;
};
