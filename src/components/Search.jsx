import React, { useEffect } from "react";

export default function Search() {
  useEffect(() => {
    document.title = "Search";
  }, []);

  return (
    <div className="search-bar">
      <i className="fa-solid fa-magnifying-glass"></i>
      <input type="search" name="search" placeholder="Explore" />
    </div>
  );
}
