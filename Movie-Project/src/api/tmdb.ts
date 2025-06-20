import type {
  FullMovie,
  Genre,
  GenreMap,
  Movie,
  MovieDetails,
} from "../types/movie";
import type {
  MovieApiResponse,
  MovieApiResult,
  MovieDetailsApiResult,
  MovieGenresResponse,
} from "../types/tmdb";
import { makeYear } from "../utils/movieUtils";
import handleApi from "./handling";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

function baseMapToMovie(
  result: MovieApiResult | MovieDetailsApiResult,
  genres: Genre[]
): Movie {
  return {
    id: result.id.toString(),
    title: result.title ?? "Untitled",
    poster: result.poster_path
      ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
      : "https://placehold.co/500x750?text=No+Poster",
    backdrop: result.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280/${result.backdrop_path}`
      : null,
    year: result.release_date ? makeYear(result.release_date) : null,
    overview: result.overview ?? null,
    rating:
      typeof result.vote_average === "number" ? result.vote_average : null,
    popularity:
      typeof result.popularity === "number" ? result.popularity : null,
    genres,
    language: result.original_language ?? null,
    release: result.release_date ?? null,
  };
}

function mapToFullMovie(result: MovieDetailsApiResult): MovieDetails {
  return {
    runtime: result.runtime ?? null,
    status: result.status ?? null,
    tagline: result.tagline ?? null,
    revenue: result.revenue ?? null,
    budget: result.budget ?? null,
    original_title:
      result.original_title !== result.title ? result.original_title : null,
  };
}

function mapMovieResultToMovie(
  result: MovieApiResult,
  genreMap: GenreMap
): Movie {
  if (!Array.isArray(result.genre_ids)) {
    console.warn("Missing genre_ids for result:", result);
    return baseMapToMovie(result, []);
  }
  const genres = result.genre_ids
    .map((id) => (genreMap[id] ? { id, name: genreMap[id] } : null))
    .filter((genre): genre is Genre => genre !== null);
  return baseMapToMovie(result, genres);
}

export async function fetchMovies(
  query: string,
  genreMap: GenreMap
): Promise<Movie[]> {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
    query
  )}`;
  const json = await handleApi<MovieApiResponse>(url);
  if (!json) return [];

  return json.results
    .filter((result) => result.id && result.title)
    .sort((a, b) => b.popularity - a.popularity) //Sort by popularity for better results
    .map((result) => mapMovieResultToMovie(result, genreMap));
}

export async function fetchMovieDetails(id: number): Promise<FullMovie | null> {
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;
  const json = await handleApi<MovieDetailsApiResult>(url);
  if (!json) return null;

  const genres = Array.isArray(json.genres) ? json.genres : [];
  return { ...baseMapToMovie(json, genres), ...mapToFullMovie(json) };
}

//Get current TMDB genres
export async function getGenres(): Promise<Genre[]> {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
  const json = await handleApi<MovieGenresResponse>(url);
  if (!json) {
    console.warn(`Unable to fetch genres. Using static genres.`);
    return STATIC_GENRES;
  }

  return json.genres;
}

//Map to standard format for differing response structures
export function createGenreMap(genres: Genre[]): GenreMap {
  const map: GenreMap = {};
  for (const genre of genres) {
    map[genre.id] = genre.name ?? "Unknown";
  }
  return map;
}

const STATIC_GENRES: Genre[] = [
  { id: 12, name: "Adventure" },
  { id: 14, name: "Fantasy" },
  { id: 16, name: "Animation" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 36, name: "History" },
  { id: 37, name: "Western" },
  { id: 53, name: "Thriller" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 878, name: "Science Fiction" },
  { id: 9648, name: "Mystery" },
  { id: 10402, name: "Music" },
  { id: 10749, name: "Romance" },
  { id: 10751, name: "Family" },
  { id: 10752, name: "War" },
  { id: 10770, name: "TV Movie" },
];
