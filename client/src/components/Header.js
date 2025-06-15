import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <a href="/" className="logo-link">
          <img src="/phobia-check-logo.png" alt="Phobia Check ロゴ" className="logo-image" />
        </a>
        <span className="beta-badge">β版</span>
      </div>
      <p className="brand-jp">ファビアチェック</p>
      <p className="subtitle">ファビア（恐怖症）を持つ方のための映画情報サイト</p>
    </header>
  );
};

export default Header;
