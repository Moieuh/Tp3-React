import { useState } from "react";
import { Link } from "react-router-dom";

function App() {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(false);

  const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

  const searchMovies = async (reset = true) => {
    if (!query) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&page=${page}${
          year ? `&y=${year}` : ""
        }${type ? `&type=${type}` : ""}`
      );
      const data = await res.json();

      if (data.Response === "True") {
        setMovies((prev) => (reset ? data.Search : [...prev, ...data.Search]));
        setHasMore(data.totalResults > page * 10); // still more to load?
      } else {
        if (reset) setMovies([]);
        setError("No movies found.");
        setHasMore(false);
      }
    } catch (err) {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    searchMovies(true); // reset results
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
    searchMovies(false); // append results
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div>
      <h1>Movie Search</h1>

 <div className="search-bar">
  <input
    className="search-input"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    onKeyDown={handleKeyPress}
    placeholder="Search by title"
  />
  <button className="search-button" onClick={handleSearch}>Search</button>
</div>

<div className="filters">
  <input
    type="number"
    placeholder="Year"
    value={year}
    onChange={(e) => setYear(e.target.value)}
  />
  <select value={type} onChange={(e) => setType(e.target.value)}>
    <option value="">All</option>
    <option value="movie">Movies</option>
    <option value="series">Series</option>
    <option value="episode">Episodes</option>
  </select>
</div>


      {/* States */}
{loading && <div className="loader"></div>}
      {error && <p>{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p>Search for a movie...</p>
      )}

      {/* Movie List */}
      <div className="movie-list">
        {movies.map((movie) => (
          <Link key={movie.imdbID} to={`/movie/${movie.imdbID}`}>
            <div className="movie-card">
              <img src={movie.Poster} alt={movie.Title} />
              <p>
                {movie.Title} ({movie.Year})
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More */}
      {hasMore && !loading && (
        <button onClick={handleLoadMore} style={{ marginTop: "20px" }}>
          Load More
        </button>
      )}
    </div>
  );
}

export default App;
