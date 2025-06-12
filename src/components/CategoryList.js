import React from "react";
import "./CategoryList.css";

const categories = [
  { label: "公開予定の映画", value: "upcoming" },
  { label: "上映中の映画", value: "now_playing" },
  { label: "話題の映画", value: "popular" },
  { label: "評価の高い映画", value: "top_rated" },
];

const CategoryList = ({ selectedCategory, onSelectCategory }) => {
  return (
    <ul className="category-list">
      {categories.map(({ label, value }) => (
        <li
          key={value}
          className={`category-item ${selectedCategory === value ? "selected" : ""}`}
          onClick={() => onSelectCategory(value)}
        >
          {label}
        </li>
      ))}
    </ul>
  );
};

export default CategoryList;
