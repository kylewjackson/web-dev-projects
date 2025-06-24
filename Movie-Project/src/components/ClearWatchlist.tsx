import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import type { HandleMovies } from "../types/movie";

type Props = {
  setWatchlist: HandleMovies;
  onHide: () => void;
  show: boolean;
};

export default function ClearWatchlist({ setWatchlist, ...props }: Props) {
  function clearWatchlist() {
    setWatchlist([]);
    props.onHide();
  }
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Clear your watchlist?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p>
          Are you sure you want to clear your watchlist? This cannot be undone.
        </p>
        <Button variant="danger" onClick={clearWatchlist}>
          Clear Watchlist
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
