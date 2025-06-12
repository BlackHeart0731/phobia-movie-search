import React from "react";
import styles from "./MoviePoster.module.css";

const MoviePoster = ({ posterUrl, title, onClick }) => {
  return (
    <img
      src={posterUrl}
      alt={title}
      className={styles.poster}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    />
  );
};

export default MoviePoster;
