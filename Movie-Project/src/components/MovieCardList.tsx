import type { HandleMovie, Movie } from "../types/movie";
import MovieCard from "./MovieCard";

type Props = {
  movies: Movie[];
  watchlist: Movie[];
  toggleWatchlist: HandleMovie;
  locationPathName: string;
  context?: string;
};

export default function MovieCardList({
  movies,
  watchlist,
  toggleWatchlist,
  locationPathName,
  context,
}: Props) {
  return (
    <ul className="list-unstyled">
      {movies.map((movie) => (
        <li key={`${context ? `${context}-` : ""}${movie.id}`}>
          <MovieCard
            movie={movie}
            watchlist={watchlist}
            toggleWatchlist={toggleWatchlist}
            outline={true}
            from={locationPathName}
            context={context}
          />
        </li>
      ))}
    </ul>
  );
}
