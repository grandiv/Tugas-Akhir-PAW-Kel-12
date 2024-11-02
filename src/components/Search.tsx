import React from "react";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  return (
    <div className="flex items-center">
      <input type="text" placeholder="Cari ..." className="search-bar" />
      <button className="search-button">
        <FaSearch />
      </button>
    </div>
  );
};

export default Search;
