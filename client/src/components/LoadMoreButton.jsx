import React from "react";
import styles from "./LoadMoreButton.module.css";

const LoadMoreButton = ({ onClick }) => {
  return (
    <button className={styles.loadMore} onClick={onClick}>
      もっと見る
    </button>
  );
};

export default LoadMoreButton;
