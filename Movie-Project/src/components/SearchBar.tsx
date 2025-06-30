import { useId } from "react";
import { Form, FloatingLabel, Row, Col, Button } from "react-bootstrap";
import type { HandleMovies } from "../types/movie";

type Props = {
  onSearch: (query: string) => void;
  query: string;
  setQuery: (q: string) => void;
  apiLoading: boolean;
  hasSearched: boolean;
  setHasSearched: (val: boolean) => void;
  setMovieResults: HandleMovies;
  clearSearch: () => void;
};

export default function SearchBar({
  onSearch,
  query,
  setQuery,
  apiLoading,
  hasSearched,
  setHasSearched,
  setMovieResults,
  clearSearch,
}: Props) {
  const searchId = useId();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setQuery(next);
    setHasSearched(false);

    // if the box is empty, clear out current results
    if (next.trim() === "") {
      setMovieResults([]);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    if (q) onSearch(q);
  }

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <Row className="gx-1">
        <Col xs={9}>
          <FloatingLabel
            controlId={searchId}
            label="Search Movies:"
            className="shadow-sm"
          >
            <Form.Control
              type="search"
              value={query}
              placeholder=" " // needed so floating label shrinks
              onChange={handleChange}
              disabled={apiLoading}
            />
          </FloatingLabel>
        </Col>
        <Col xs={3}>
          <Button
            type="submit"
            variant="primary"
            className="shadow-sm w-100 h-100"
            disabled={apiLoading || !query.trim()}
          >
            Search
          </Button>
        </Col>
        {hasSearched && (
          <Col className="mt-1 text-end">
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={clearSearch}
              className="text-body"
            >
              Clear
            </Button>
          </Col>
        )}
      </Row>
    </Form>
  );
}
