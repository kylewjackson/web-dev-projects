import MovieDetails, { type Props } from "../components/MovieDetails";

export default function MovieDetailView(props: Props) {
  return (
    <main className="row">
      <MovieDetails {...props} />
    </main>
  );
}
