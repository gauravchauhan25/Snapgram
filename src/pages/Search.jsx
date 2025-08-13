import { useEffect, useState } from "react";
import SearchCard from "../components/SearchCard";
import api from "../services/appwrite";
import "../page-styles/Search.css";
import { loaderIcon } from "../assets/categories";
import { AiOutlineFrown } from "react-icons/ai";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Search";
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await api.searchUsers(value);
      setResults(res.documents || []);
    } catch (error) {
      console.log("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search">
      <div className="search-bar ">
        <img
          src="/icons/search.svg"
          alt="Search Icon"
          style={{ width: "20px", height: "20px" }}
        />

        <input
          type="search"
          name="search"
          placeholder="Explore"
          value={query}
          onChange={handleSearch}
        />
      </div>

      <div className="search-results">
        {/* <h2>Search Results</h2> */}
        {/* <div className="search-btns">
          <button role="button">Users</button>
          <button role="button">Posts</button>
        </div> */}

        <div className="search-loader">{loading && loaderIcon.icon}</div>
        {!loading && results.length === 0 && query && <p className="flex justify-center items-center text-center text-sm md:text-lg">🙁Sorry! No user found.</p>}

        {results.map((user) => (
          <SearchCard key={user.$id} user={user} />
        ))}
      </div>
    </div>
  );
}
