import { useId } from "react";

type Props = {
  onSearch: (query: string) => void;
  query: string;
  setQuery: (query: string) => void;
};

export default function SearchBar({ onSearch, query, setQuery }: Props) {
  const searchId = useId();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formattedQuery = query.trim();
    onSearch(formattedQuery);
  }

  return (
    //gx-1 class to correct Bootstrap floating form padding
    <form onSubmit={handleSearch} className="mb-4 row gx-1">
      <div className="form-floating col-9">
        <input
          id={searchId}
          type="search"
          name="searchQuery"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder=" " //For Bootstrap floating form
          className="form-control"
        />
        <label htmlFor={searchId}>Search Movies:</label>
      </div>
      <button
        type="submit"
        className="col-3 btn btn-primary"
        disabled={!query.trim()}
      >
        Search
      </button>
    </form>
  );
}
