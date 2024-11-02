import React from "react";
import { FaSearch } from "react-icons/fa";
import { useSearch } from "@/context/SearchContext";

const Search = () => {
  const { setSearchTerm } = useSearch();

  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder="Cari ..."
        className="search-bar"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="search-button">
        <FaSearch />
      </button>
    </div>
  );
};

export default Search;
