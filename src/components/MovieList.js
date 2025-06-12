import React, { useEffect, useCallback, useState } from "react";
import styles from "./MovieList.module.css";
import MoviePoster from "./MoviePoster";

const MovieList = ({ category, query, visibleCount, onMovieClick }) => {
  const [movies, setMovies] = useState([]);
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const validatedCategory = category || "popular";

  const fetchMovies = useCallback(async () => {
    if (!API_KEY) {
      console.error("API_KEY が定義されていません！");
      setMovies([]);
      return;
    }

    const url = query
      ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ja-JP&query=${encodeURIComponent(query)}`
      : `https://api.themoviedb.org/3/movie/${validatedCategory}?api_key=${API_KEY}&language=ja-JP`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`APIリクエスト失敗: ステータスコード ${response.status}`);
        setMovies([]);
        return;
      }

      const data = await response.json();
      setMovies(Array.isArray(data.results) ? data.results : []);
    } catch (error) {
      console.error("映画データの取得に失敗しました:", error);
      setMovies([]);
    }
  }, [validatedCategory, query, API_KEY]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const JapaneseTitle = ({ title }) => {
    if (!title) return null;
    return <h3 className={styles.titleJa}>{title}</h3>;
  };

  return (
    <div className="movie-list">
      {movies.length > 0 ? (
        movies.slice(0, visibleCount).map((movie) => (
          <div key={movie.id} className={styles.card}>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => onMovieClick && onMovieClick(movie.id, movie.title)}
            >
              <MoviePoster
                movieId={movie.id}
                posterUrl={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/500"
                }
                title={movie.title}
                overview={movie.overview}
                voteAverage={movie.vote_average}
              />
            </div>

            <JapaneseTitle title={movie.title} />
            {movie.original_title && movie.original_title !== movie.title && (
              <h4 className={styles.titleEn}>{movie.original_title}</h4>
            )}
            <p>⭐ {movie.vote_average ?? "評価なし"}</p>
          </div>
        ))
      ) : (
        <p style={{ color: "red" }}>⚠️ 映画データが取得できませんでした。</p>
      )}
    </div>
  );
};

export default MovieList;
