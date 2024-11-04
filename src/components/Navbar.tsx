"use client"; // Tambahkan ini di baris pertama

import React, { useState } from "react";
import Link from "next/link";
import "./Navbar.css";
import Search from "./Search";

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md py-4 px-6 flex justify-between items-center z-50">
      <div className="flex items-center">
        <img src="/Logo_icon.png" alt="Logo" className="logo" />
      </div>
      <div className="flex items-center space-x-6">
        <Link href="/" className="text-gray-700 hover:text-green-600">
          🏠︎ Home
        </Link>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="text-gray-700 hover:text-green-600 focus:outline-none"
          >
            ✎ Kategori
          </button>
          {isDropdownOpen && (
            <div className="absolute bg-green-dropdown shadow-lg rounded-md mt-2 w-40 z-10">
              <Link
                href="/sayur"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Sayur
              </Link>
              <Link
                href="/buah"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Buah
              </Link>
              <Link
                href="/daging"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Daging
              </Link>
              <Link
                href="/seafood"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Seafood
              </Link>
              <Link
                href="/dairy"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Dairy
              </Link>
            </div>
          )}
        </div>
        <Link href="/cart" className="text-gray-700 hover:text-green-600">
          🛍 Keranjang
        </Link>
      </div>
      <Search />
      <div className="nav-login-cart">
        <Link href="/login">
          <button>Sign In</button>
        </Link>
      </div>
      {isDropdownOpen && (
        <div className="fixed inset-0 z-0" onClick={closeDropdown}></div>
      )}
    </nav>
  );
};

export default Navbar;
