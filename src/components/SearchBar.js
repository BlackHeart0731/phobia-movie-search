import React, { useState } from "react";
import './SearchBar.css';

const SearchBar = ({ onSearch, onCategoryChange }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("popular");

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    onCategoryChange(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();  // ページリロード防止
    onSearch(query);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="映画を検索..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <select value={category} onChange={handleCategoryChange}>
        <option value="popular">人気</option>
        <option value="top_rated">高評価</option>
        <option value="upcoming">近日公開</option>
      </select>
      <button type="submit">検索</button>
    </form>
  );
};

export default SearchBar;

