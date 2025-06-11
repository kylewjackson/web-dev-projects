import "./App.css";
import Logo from "./assets/logo.svg";
import { useState } from "react";
import { type Movie } from "./types/movie";
import Main from "./views/Main";
import WatchlistView from "./views/WatchlistView";

function App() {
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<Error | null>(null);
  const [ariaMessage, setAriaMessage] = useState<string>("");
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [view, setView] = useState("main");

  return (
    <div className="container py-4">
      {/* aria-live annoucment message for state changes */}
      <div id="announce" aria-live="polite" className="visually-hidden">
        <p>{ariaMessage}</p>
      </div>
      <header className="text-center mb-4">
        <nav className="navbar navbar-expand-sm bg-body-tertiary">
          <div className="container-fluid">
            <button className="nav-link" onClick={() => setView("main")}>
              <h1 className="navbar-brand mb-0 d-flex align-items-center">
                <img
                  src={Logo}
                  alt="Movie Watchlist App"
                  width={30}
                  height={40}
                />
                <p className="d-sm-none m-0 ps-3">Watchlist App</p>
              </h1>
            </button>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#Navbar"
              aria-controls="Navbar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="Navbar">
              <ul className="navbar-nav">
                <button
                  className={`nav-link ${view === "main" && "active"}`}
                  aria-current={view === "main" && "page"}
                  disabled={view === "main" && true}
                  onClick={() => setView("main")}
                >
                  Search
                </button>
                <button
                  className={`nav-link ${view === "watchlist" && "active"}`}
                  aria-current={view === "watchlist" && "page"}
                  onClick={() => setView("watchlist")}
                  disabled={view === "watchlist" && true}
                >
                  Watchlist
                </button>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      {view === "main" ? (
        <Main
          apiLoading={apiLoading}
          apiError={apiError}
          setApiLoading={setApiLoading}
          setApiError={setApiError}
          setAriaMessage={setAriaMessage}
          watchlist={watchlist}
          setWatchlist={setWatchlist}
        />
      ) : (
        view === "watchlist" && (
          <WatchlistView watchlist={watchlist} setWatchlist={setWatchlist} />
        )
      )}
    </div>
  );
}

export default App;
