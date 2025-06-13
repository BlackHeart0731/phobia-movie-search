import React from "react";

const ShareButtonX = ({ url, text }) => {
  const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;

  return (
    <a
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontSize: "1.5rem",
        textDecoration: "none",
        color: "#1DA1F2", // X（旧Twitter）ブルー
        padding: "6px 10px",
        borderRadius: "6px",
        border: "1.5px solid #1DA1F2",
        display: "inline-block",
        cursor: "pointer",
        userSelect: "none",
        fontWeight: "bold",
      }}
      aria-label="Xでシェア"
      title="Xでシェア"
    >
      𝕏
    </a>
  );
};

export default ShareButtonX;
