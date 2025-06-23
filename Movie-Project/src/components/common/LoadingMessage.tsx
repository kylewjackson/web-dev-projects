import { Spinner } from "react-bootstrap";

type Props = {
  context: string;
};

export default function LoadingMessage({ context }: Props) {
  return (
    <div className="text-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading {context}...</span>
      </Spinner>
    </div>
  );
}
