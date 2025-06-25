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

  function handleCurrentPage(page: number) {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setCurrentPage(page);
  }

  const visibleItems = useMemo(() => {
    const start = (currentPage - 1) * maxPerPage;
    return watchlist.slice(start, start + maxPerPage);
  }, [watchlist, currentPage, maxPerPage]);

  const paginationItems = [];
  const delta = 2;

  if (totalPages <= 5 + delta * 2) {
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handleCurrentPage(i)}
          aria-label={`Go to page ${i}`}
        >
          {i}
        </Pagination.Item>
      );
    }
  } else {
    paginationItems.push(
      <Pagination.Item
        key={1}
        active={1 === currentPage}
        onClick={() => handleCurrentPage(1)}
        aria-label={`Go to page 1`}
      >
        1
      </Pagination.Item>
    );

    if (currentPage - delta > 2) {
      paginationItems.push(
        <Pagination.Ellipsis key="start-ellipsis" disabled />
      );
    }

    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    for (let i = start; i <= end; i++) {
      paginationItems.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handleCurrentPage(i)}
          aria-label={`Go to page ${i}`}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (currentPage + delta < totalPages - 1) {
      paginationItems.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
    }

    paginationItems.push(
      <Pagination.Item
        key={totalPages}
        active={totalPages === currentPage}
        onClick={() => handleCurrentPage(totalPages)}
        aria-label={`Go to page ${totalPages}`}
      >
        {totalPages}
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
          <Pagination className="d-flex flex-wrap justify-content-center pe-0">
            {paginationItems}
          </Pagination>
        </Row>
      )}

      {watchlist.length > 0 && (
        <Col xs={12} className="text-center">
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
