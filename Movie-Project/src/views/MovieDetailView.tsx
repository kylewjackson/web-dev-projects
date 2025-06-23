import { Row } from "react-bootstrap";
import MovieDetails, { type Props } from "../components/MovieDetails";

export default function MovieDetailView(props: Props) {
  return (
    <Row>
      <MovieDetails {...props} />
    </Row>
  );
}
