//Title + Year format for various contexts
export type FormatTitleOptions = {
  title: string;
  year: Year;
  variant?: "card" | "raw";
};

export type Year = (number & { __brand: "Year" }) | null;

export type Movie = {
  id: string;
  title: string;
  year: Year;
  poster: string;
  overview: string;
};
