import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
        );
        const data = await res.json();

        if (data.Response === "True") {
          setMovie(data);
        } else {
          setError("Movie not found.");
        }
      } catch {
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id, API_KEY]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

return (
  <div className="details-container">
    <button onClick={() => navigate(-1)}>Back</button>
    <h2>{movie.Title} ({movie.Year})</h2>
    <img src={movie.Poster} alt={movie.Title} />
    <p><strong>Rating:</strong> {movie.imdbRating}</p>
    <p><strong>Plot:</strong> {movie.Plot}</p>
  </div>
);

}

export default MovieDetails;
