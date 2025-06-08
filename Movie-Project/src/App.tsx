import SearchBar from "./components/SearchBar";

function Main() {
  return (
    <main className="row justify-content-center">
      <section className="col-9 col-lg-6">
        <SearchBar onSearch={(query) => console.log("Searching for:", query)} />
      </section>
    </main>
  );
}

function App() {
  return (
    <div className="container py-4">
      <header className="text-center mb-2">
        <h1>Movie Watchlist</h1>
      </header>
      <Main />
    </div>
  );
}

export default App;
