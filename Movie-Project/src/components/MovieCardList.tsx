import type { HandleMovie, Movie } from "../types/movie";
import MovieCard from "./MovieCard";

type Props = {
  movies: Movie[];
  watchlist: Movie[];
  toggleWatchlist: HandleMovie;
  locationPathName: string;
  context?: string;
  currentPage?: number;
};

export default function MovieCardList({
  movies,
  watchlist,
  toggleWatchlist,
  locationPathName,
  context,
  currentPage,
}: Props) {
  return (
    <ul className="list-unstyled">
      {movies.map((movie) => (
        <li key={`${context ? `${context}-` : ""}${movie.id}`}>
          <MovieCard
            movie={movie}
            watchlist={watchlist}
            toggleWatchlist={toggleWatchlist}
            outline={false}
            from={locationPathName}
            context={context}
            page={currentPage}
          />
        </li>
      ))}
    </ul>
  );
}
