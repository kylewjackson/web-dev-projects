import type { JSX } from "react";
import type { FormatTitleOptions, Year } from "../types/movie";

export function makeYear(input: string | number): Year {
  const year = typeof input === "string" ? Number(input.split("-")[0]) : input;
  if (!Number.isInteger(year) || year < 1888) {
    //Release year is invalid / does not exist
    return null as Year;
  }

  return year as Year;
}

export function formatTitleWithYear({
  title,
  year,
  variant = "raw",
}: FormatTitleOptions): JSX.Element | string {
  if (variant === "card") {
    return (
      <>
        <span>{title}</span>
        {year && <span className="text-body-tertiary"> ({year})</span>}
      </>
    );
  }
  return `${title} ${year && `(${year})`}`;
}
