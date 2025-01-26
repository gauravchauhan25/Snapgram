import React, { useState } from "react";
import { Link } from "react-router-dom";
import { categories } from "../sources/categories";
import profilePhoto from "../img/profile-photo.jpg";

export default function Sidebar({ selectedCategory, setSelectedCategory }) {
  return (
    <>
      <div className="sidebar">
        <div className="logo">
          <img
            src="https://cdn-icons-png.flaticon.com/128/185/185985.png"
            alt=""
          />
          <h2>Snapgram</h2>
        </div>

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

      {/* <div className="profile">
        <div className="profile-photo">
          <img src={profilePhoto} alt="" />
        </div>
        <h4>Gaurav Chauhan</h4>
      </div> */}
    </>
  );
}
