import React, { useEffect } from "react";

export default function Search() {
  useEffect(() => {
    document.title = "Search";
  }, []);

  return (
    <div className="search-bar">
      <img src="/icons/search.svg" alt="Search Icon" style={{ width: "20px", height: "20px" }} />
      <input type="search" name="search" placeholder="Explore" />
    </div>
  );
}
