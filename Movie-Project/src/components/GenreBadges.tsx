import type { Genre, Movie } from "../types/movie";

type Props = {
  genres: Genre[];
  movie: Movie;
	variant?: string;
};

export default function GenreBadges({ genres, movie, variant = 'secondary' }: Props) {
  return (
    <ul className="list-unstyled d-flex flex-wrap mb-2">
      {genres.map((genre) => (
        <li key={`${movie.id}--${genre.id}`}>
          <span className={`me-1 badge text-bg-${variant}`}>{genre.name}</span>
        </li>
      ))}
    </ul>
  );
}
