import { useId } from "react";
import { Form, FloatingLabel, Row, Col, Button } from "react-bootstrap";

type Props = {
  onSearch: (query: string) => void;
  query: string;
  setQuery: (query: string) => void;
  apiLoading: boolean;
  setHasSearched: (val: boolean) => void;
};

export default function SearchBar({
  onSearch,
  query,
  setQuery,
  apiLoading,
  setHasSearched,
}: Props) {
  const searchId = useId();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formattedQuery = query.trim();
    onSearch(formattedQuery);
  }

  return (
    <Form onSubmit={handleSearch} className="mb-4">
      <Row className="gx-1">
        <Col xs={9}>
          <FloatingLabel
            controlId={searchId}
            label="Search Movies:"
            className="shadow-sm"
          >
            <Form.Control
              type="search"
              placeholder="Search Movies:" // required for floating label
              value={query}
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
