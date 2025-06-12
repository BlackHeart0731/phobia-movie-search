import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY || "YOUR_DEFAULT_API_KEY"; // APIキーのデフォルト値
console.log("APIキーの値:", API_KEY); // ✅ APIキーの確認

const categories = [
  { id: "upcoming", title: "公開予定の映画", endpoint: "upcoming" },
  { id: "nowPlaying", title: "上映中の映画", endpoint: "now_playing" },
  { id: "popular", title: "話題の映画", endpoint: "popular" },
  { id: "topRated", title: "評価の高い映画", endpoint: "top_rated" }
];

const MovieList = ({ movies = [], visibleCount, showMoreMovies, categoryId }) => {
  console.log(`表示する映画データ (${categoryId}):`, movies); // ✅ ログ確認

  return (
    <div className="movie-list">
      {movies.slice(0, visibleCount).map(movie => (
        <div key={movie.id} className="movie-item">
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder.png"}
            alt={movie.title}
          />
          <h3>{movie.title} ({movie.release_date?.substring(0, 4)})</h3>
        </div>
      ))}
      {visibleCount < movies.length && (
        <button className="load-more" onClick={() => showMoreMovies(categoryId)}>もっと見る</button>
      )}
    </div>
  );
};

const MovieCategories = () => {
  const [movies, setMovies] = useState({});
  const [visibleCount, setVisibleCount] = useState({});

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        console.log("映画データを取得中..."); // ✅ APIリクエスト開始ログ
        const responses = await Promise.all(
          categories.map(cat =>
            axios.get(`https://api.themoviedb.org/3/movie/${cat.endpoint}?api_key=${API_KEY}&language=ja-JP&page=1`)
          )
        );

        const newMovies = {};
        categories.forEach((cat, index) => {
          newMovies[cat.id] = responses[index].data.results;
        });

        console.log("取得した映画データ:", newMovies); // ✅ APIデータ確認ログ
        setMovies(newMovies);
        setVisibleCount(categories.reduce((acc, cat) => ({ ...acc, [cat.id]: 8 }), {})); // ✅ 初期表示件数を設定
      } catch (error) {
        console.error("映画データの取得に失敗しました", error);
      }
    };

    fetchMovies();
  }, []);

  const showMoreMovies = categoryId => {
    setVisibleCount(prev => ({
      ...prev,
      [categoryId]: (prev[categoryId] || 8) + 8
    }));
  };

  return (
    <div>
      {categories.map(cat => (
        <div key={cat.id}>
          <h2>{cat.title}</h2>
          <MovieList
            movies={movies[cat.id] || []}
            visibleCount={visibleCount[cat.id] || 8}
            showMoreMovies={showMoreMovies}
            categoryId={cat.id}
          />
        </div>
      ))}
    </div>
  );
};

export default MovieCategories;