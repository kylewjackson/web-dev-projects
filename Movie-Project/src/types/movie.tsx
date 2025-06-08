import type { JSX } from "react";

//Title + Year format for various contexts
type FormatTitleOptions = {
  title: string;
  year: Year;
  variant?: "card" | "raw";
};

export function formatTitleWithYear({
  title,
  year,
  variant = "raw",
}: FormatTitleOptions): JSX.Element | string {
  if (variant === "card") {
    return (
      <>
        <span>{title}</span>
        <span className="text-body-tertiary"> ({year})</span>
      </>
    );
  }
  return `${title} (${year})`;
}

//Future proofing for eventual API usage
type Year = number & { __brand: "Year" };

export function makeYear(year: number) {
  if (!Number.isInteger(year) || year < 1888) {
    throw new ReferenceError("Invalid year: must be an integer ≥ 1888");
  }

  return year as Year;
}

export type Movie = {
  id: string;
  title: string;
  year: Year;
  poster: string;
};
