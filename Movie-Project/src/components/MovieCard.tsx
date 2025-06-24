import { useState } from "react";
import type { Movie, HandleMovie } from "../types/movie";
import { formatTitleWithYear } from "../utils/movieUtils";
import { NavLink } from "react-router";
import slugify from "slugify";
import { Card, Row, Col, Button, Collapse } from "react-bootstrap";
import WatchlistButton from "./WatchlistButton";
import GenreBadges from "./GenreBadges";
import formatLanguage from "../utils/formatLanguage";
import RatingIcon from "./common/RatingIcon";

type Props = {
  movie: Movie;
  watchlist: Movie[];
  toggleWatchlist: HandleMovie;
  outline?: boolean;
  variant?: string;
  from: string;
  context?: string;
};

export default function MovieCard({
  movie,
  watchlist,
  toggleWatchlist,
  outline,
  variant,
  from,
  context,
}: Props) {
  const {
    id,
    title,
    year,
    poster,
    overview,
    rating,
    release,
    language,
    genres,
  } = movie;
  const [expanded, setExpanded] = useState(false);
  const slug = slugify(title, "+");
  const isInWatchlist = watchlist.some((m) => m.id === id);
  const collapseId = `collapse-${context ? `${context}-` : ""}${id}`;

  return (
    <Card className="mb-3">
      <Row>
        <Col xs={4} md={3}>
          <NavLink to={`/movie/${id}/${slug}`} state={{ from }} tabIndex={-1}>
            <img
              src={poster}
              alt={"poster for: " + title}
              className="img-fluid movie-card--rounded-top-left shadow-sm"
            />
          </NavLink>
        </Col>

        <Col xs={8} md={9} className="ps-0 ps-md-2">
          <Card.Body className="p-2 ps-0 p-md-9">
            <Card.Title as="h2" className="h4">
              {formatTitleWithYear({ title, year, variant: "card" })}
            </Card.Title>

            <div className="d-flex flex-column align-items-start">
              <NavLink
                to={`/movie/${id}/${slug}`}
                state={{ from }}
                className="btn btn-link ps-0 me-2 mb-2"
                style={
                  {
                    "--bs-btn-color": "var(--bs-body-text)",
                    "--bs-btn-hover-color": "var(--bs-body-text-emphasis)",
                  } as React.CSSProperties
                }
              >
                <span>
                  Full Details
                  <i className="ps-1 bi bi-arrow-right-circle" />
                </span>
              </NavLink>

              <WatchlistButton
                movie={movie}
                isInWatchlist={isInWatchlist}
                toggleWatchlist={toggleWatchlist}
                outline={outline}
                variant={variant}
              />
            </div>
          </Card.Body>
        </Col>
      </Row>

      <Button
        variant="link"
        className="col-12 mt-2 text-body text-decoration-none"
        onClick={() => setExpanded((e) => !e)}
        aria-controls={collapseId}
        aria-expanded={expanded}
      >
        {expanded ? (
          <>
            Show Less <i className="bi bi-chevron-up" />
          </>
        ) : (
          <>
            Show More <i className="bi bi-chevron-down" />
          </>
        )}
      </Button>

      <Collapse in={expanded}>
        <div id={collapseId} className="mt-2 col-11 mx-auto row">
          <h3 className="h5">Overview</h3>

          {genres.length > 0 && (
            <>
              <h4 className="visually-hidden">Genre</h4>
              <GenreBadges movie={movie} genres={genres} />
            </>
          )}

          {overview && (
            <>
              <h4 className="visually-hidden">Synopsis</h4>
              <p>{overview}</p>
            </>
          )}

          {language && (
            <>
              <h4 className="h6">Language</h4>
              <p>{formatLanguage(language)}</p>
            </>
          )}

          {release && (
            <>
              <h4 className="h6">Release</h4>
              <p>{release}</p>
            </>
          )}

          {rating != null && rating > 0 && (
            <>
              <h4 className="h6">Avg. Rating</h4>
              <p>
                <RatingIcon val={Math.round(rating)} className="pe-1" />
                {Math.round(rating)}
              </p>
            </>
          )}
        </div>
      </Collapse>
    </Card>
  );
}
