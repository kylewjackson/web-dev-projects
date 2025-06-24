import React from "react";
import { useLocation, useOutletContext } from "react-router";
import { Button, Col, Row } from "react-bootstrap";
import { type AppContextType } from "../App";
import useWatchlistRefresh from "../hooks/useWatchlistRefresh";
import MovieCardList from "../components/MovieCardList";
import ClearWatchlist from "../components/ClearWatchlist";

export default function WatchlistView() {
  const { watchlist, setWatchlist, toggleWatchlist } =
    useOutletContext<AppContextType>();
  const [modalShow, setModalShow] = React.useState(false);

  useWatchlistRefresh(watchlist, setWatchlist);
  const location = useLocation();

  return (
    <>
      <h1 className="text-center my-3">Watchlist</h1>

      <Col as="section" xs={11} lg={5}>
        {watchlist.length > 0 ? (
          <MovieCardList
            movies={watchlist}
            watchlist={watchlist}
            toggleWatchlist={toggleWatchlist}
            locationPathName={location.pathname}
          />
        ) : (
          <h2 className="h4 text-center">Nothing in watchlist</h2>
        )}
      </Col>
      {watchlist.length > 0 && (
        <Row>
          <Col xs={11} lg={5} className="mx-auto text-center">
            <Button variant="danger" onClick={() => setModalShow(true)}>
              Clear Watchlist?
            </Button>

            <ClearWatchlist
              show={modalShow}
              onHide={() => setModalShow(false)}
              setWatchlist={setWatchlist}
            />
          </Col>
        </Row>
      )}
    </>
  );
}
