import { useId, useRef, useEffect } from "react";
import { Form, FloatingLabel, Row, Col, Button } from "react-bootstrap";
import type { HandleMovies } from "../types/movie";

type Props = {
  onSearch: (query: string) => void;
  onClear?: () => void;
  query: string;
  setQuery: (q: string) => void;
  apiLoading: boolean;
  setHasSearched: (val: boolean) => void;
  setMovieResults: HandleMovies;
};

export default function SearchBar({
  onSearch,
  onClear,
  query,
  setQuery,
  apiLoading,
  setHasSearched,
  setMovieResults,
}: Props) {
  const searchId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const handleNativeSearch = (e: Event) => {
      // only treat it as a "clear" if value is empty
      if ((e.target as HTMLInputElement).value === "") {
        setMovieResults([]);
        setHasSearched(false);
        onClear?.();
      }
    };
    input.addEventListener("search", handleNativeSearch);
    return () => input.removeEventListener("search", handleNativeSearch);
  }, [onClear, setHasSearched, setMovieResults]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    onSearch(q);
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
              ref={inputRef}
              value={query}
              placeholder=" " // needed so floating label shrinks
              onChange={(e) => {
                setQuery(e.target.value);
                setHasSearched(false);
              }}
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
      </Row>
    </Form>
  );
}
