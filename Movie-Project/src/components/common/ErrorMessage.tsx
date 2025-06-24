import { Alert } from "react-bootstrap";

type Props = {
  message: string;
};

export default function ErrorMessage({ message }: Props) {
  return <Alert variant="danger">Something went wrong: {message}</Alert>;
}
