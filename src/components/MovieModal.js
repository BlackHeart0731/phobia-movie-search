import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import ScaryForm from "./ScaryForm";
import styles from "./MovieModal.module.css";
import ShareButtonX from "./ShareButtonX";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
console.log("TMDB API KEY:", API_KEY);

const MovieModal = ({
  isOpen,
  onClose,
  movieId,
  title,
  onAddFearReport,
  fearReports,  // ← ここを追加
}) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 前回のmovieIdを保持してfetchの重複防止に使う
  const prevMovieIdRef = useRef(null);

  // ローカルでの恐怖要素リスト（新規追加分もここに一旦保持）
  const [localScaryItems, setLocalScaryItems] = useState([]);

  useEffect(() => {
    if (!isOpen || !movieId) return;
    if (prevMovieIdRef.current === movieId) return;

    prevMovieIdRef.current = movieId;
    setMovieDetails(null);
    setLocalScaryItems([]); // モーダル切り替え時はローカルの追加恐怖要素もリセット
    setError(null);

    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=ja-JP`
        );
        if (!res.ok) throw new Error(`ステータスコード ${res.status}`);
        const data = await res.json();
        setMovieDetails(data);
      } catch (e) {
        setError("映画情報の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [isOpen, movieId]);

  // 新規恐怖要素追加ハンドラ
  const handleAddScaryItem = (newItem) => {
    // まずローカルstateにも追加
    setLocalScaryItems((prev) => [...prev, newItem]);

    // そして親に送信（DB保存等の処理）
    if (onAddFearReport && movieId) {
      // movieIdをnewItemにセットして渡す
      onAddFearReport({ ...newItem, movieId });
    }
  };

  // fearReportsから今のmovieIdに該当する恐怖要素を抽出
  const relatedReports = fearReports
    ? fearReports.filter((report) => report.movieId === movieId)
    : [];

  // 表示用に、サーバーからのレポートとローカルで追加したものを合体
  const combinedScaryItems = [...relatedReports, ...localScaryItems];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className={styles.modalContent}>
        {loading && <p className={styles.status}>読み込み中...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && movieDetails && (
          <>
            <div className={styles.detailWrapper}>
              <img
                src={
                  movieDetails.poster_path
                    ? `https://image.tmdb.org/t/p/w300${movieDetails.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={movieDetails.title}
                className={styles.detailPoster}
              />
              <div className={styles.detailText}>
                <p>
                  <strong>公開日:</strong> {movieDetails.release_date || "不明"}
                </p>
                <p>
                  <strong>ジャンル:</strong>{" "}
                  {movieDetails.genres && movieDetails.genres.length > 0
                    ? movieDetails.genres.map((g) => g.name).join(", ")
                    : "なし"}
                </p>
                <p>
                  <strong>評価:</strong> {movieDetails.vote_average || "なし"}
                </p>
                <p>
                  <strong>あらすじ:</strong> {movieDetails.overview || "なし"}
                </p>
                <p>
                  <strong>上映時間:</strong>{" "}
                  {movieDetails.runtime ? `${movieDetails.runtime}分` : "なし"}
                </p>
              </div>
            </div>

            <h3>登録された恐怖要素</h3>
            {combinedScaryItems.length === 0 ? (
              <p>登録なし</p>
            ) : (
              <ul className={styles.scaryList}>
                {combinedScaryItems.map((item, i) => (
                  <li key={i}>
                    {item.types.join(", ")} — {item.detail}{" "}
                    {item.time && `(${item.time})`}
                  </li>
                ))}
              </ul>
            )}

            <div style={{ marginTop: "1rem" }}>
              <ShareButtonX
                url={window.location.href}
                text={`映画「${title}」をチェック！`}
              />
            </div>

            <ScaryForm onAdd={handleAddScaryItem} />
          </>
        )}
      </div>
    </Modal>
  );
};

export default MovieModal;
