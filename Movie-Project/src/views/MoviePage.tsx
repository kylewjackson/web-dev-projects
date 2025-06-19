import MovieDetails, { type Props } from "../components/MovieDetails";

export default function MoviePage(props: Props) {
  return (
    <main className="row">
      <MovieDetails {...props} />
    </main>
  );
}
