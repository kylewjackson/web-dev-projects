import { type Movie } from "../types/movie";
import { formatTitleWithYear } from "../utils/movieUtils";

type Props = {
  movie: Movie;
};

export default function MovieCard({ movie }: Props) {
  const { title, year, poster, overview } = movie;
  return (
    <div className="card mb-3">
      <div className="row">
        <div className="col-4">
          <img
            src={poster}
            alt={"poster for: " + title}
            className="img-fluid rounded-start"
          />
        </div>
        <div className="col-8">
          <div className="card-body">
            <h3 className="card-title">
              {formatTitleWithYear({ title, year, variant: "card" })}
            </h3>
            <p className="card-text truncate-5">{overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
