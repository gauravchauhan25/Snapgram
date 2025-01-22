import React, { useState } from "react";
import { Link } from "react-router-dom";
import { categories } from "../sources/categories";

export default function Sidebar({ selectedCategory, setSelectedCategory }) {
  return (
    <>
      <div className="sidebar">
        {categories.map((category) => (
          <div className="category">
            <Link
              to={`/${category.name}`}
              className={`menu-item ${
                selectedCategory === category.name ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.name)}
              key={category.name}
            >
              <span>{category.icon}</span>
              <h3
                style={
                  selectedCategory === "Messages" ? { display: "none" } : {}
                }
              >
                {category.name}
              </h3>
            </Link>
          </div>
        ))}
      </div>

      <label
        className="btn btn-primary"
        style={selectedCategory === "Messages" ? { display: "none" } : {}}
      >
        Create Post
      </label>
    </>
  );
}
