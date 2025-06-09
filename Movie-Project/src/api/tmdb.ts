import type { Movie } from "../types/movie";
import type { MovieApiResult } from "../types/tmdb";
import { makeYear } from "../utils/movie";

export function mapMovieResultToMovie(result: MovieApiResult): Movie {
	return {
		id: result.id.toString(),
		title: result.title,
		poster: result.poster_path
			? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
			: "https://placehold.co/500x750",
		year: makeYear(result.release_date),
	};
}