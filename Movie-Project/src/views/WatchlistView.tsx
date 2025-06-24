import { useState, useEffect, useMemo } from "react";
import { useLocation, useOutletContext } from "react-router";
import { Button, Col, Row, Pagination } from "react-bootstrap";
import type { AppContextType } from "../App";
import useWatchlistRefresh from "../hooks/useWatchlistRefresh";
import MovieCardList from "../components/MovieCardList";
import ClearWatchlist from "../components/ClearWatchlist";

export default function WatchlistView() {
  const { watchlist, setWatchlist, toggleWatchlist } =
    useOutletContext<AppContextType>();
  const [modalShow, setModalShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const maxPerPage = 20;
  const totalPages = Math.ceil(watchlist.length / maxPerPage);

  useWatchlistRefresh(watchlist, setWatchlist);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [watchlist, totalPages, currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [currentPage]);

  const visibleItems = useMemo(() => {
    const start = (currentPage - 1) * maxPerPage;
    return watchlist.slice(start, start + maxPerPage);
  }, [watchlist, currentPage, maxPerPage]);

  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => setCurrentPage(i)}
        aria-label={`Go to page ${i}`}
      >
        {i}
      </Pagination.Item>
    );
  }

  const location = useLocation();

  return (
    <>
      <h1 className="text-center my-3">Watchlist</h1>

      <Col as="section" xs={11} lg={5}>
        {watchlist.length > 0 ? (
          <MovieCardList
            movies={visibleItems}
            watchlist={watchlist}
            toggleWatchlist={toggleWatchlist}
            locationPathName={location.pathname}
          />
        ) : (
          <h2 className="h4 text-center">Nothing in watchlist</h2>
        )}
      </Col>

      {totalPages > 1 && (
        <Row as="nav" className="py-3">
          <Pagination className="d-flex justify-content-center pe-0">
            {paginationItems}
          </Pagination>
        </Row>
      )}

      {watchlist.length > 0 && (
        <Col className="text-center">
          <Button variant="danger" onClick={() => setModalShow(true)}>
            Clear Watchlist?
          </Button>

          <ClearWatchlist
            show={modalShow}
            onHide={() => setModalShow(false)}
            setWatchlist={setWatchlist}
          />
        </Col>
      )}
    </>
  );
}
