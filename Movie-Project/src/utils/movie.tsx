import type { JSX } from "react";
import type { FormatTitleOptions, Year } from "../types/movie";

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

export function makeYear(input: string | number): Year {
	const year = typeof input === "string" ? Number(input.split("-")[0]) : input;
	if (!Number.isInteger(year) || year < 1888) {
		throw new ReferenceError("Invalid year: must be an integer ≥ 1888");
	}

	return year as Year;
}