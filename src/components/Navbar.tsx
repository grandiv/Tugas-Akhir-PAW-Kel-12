"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import "./Navbar.css";
import Search from "./Search";
import Image from "next/image";

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session, update: updateSession } = useSession();
  const [profilePicture, setProfilePicture] = useState("/user.png");

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (session?.user) {
        try {
          const response = await fetch("/api/profile");
          const data = await response.json();

          if (data.success) {
            setProfilePicture(data.user.profilePicture || "/user.png");
            // Update session with the latest profile picture
            await updateSession({
              ...session.user,
              image: data.user.profilePicture,
            });
          }
        } catch (error) {
          console.error("Error fetching profile picture:", error);
        }
      }
    };

    fetchProfilePicture();
  }, [session?.user, updateSession]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md py-4 px-6 flex justify-between items-center z-50">
      <div className="flex items-center">
        <Image
          height={500}
          width={500}
          src="/Logo_icon.png"
          alt="Logo"
          className="logo"
        />
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
                onClick={closeDropdown}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Sayur
              </Link>
              <Link
                href="/buah"
                onClick={closeDropdown}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Buah
              </Link>
              <Link
                href="/daging"
                onClick={closeDropdown}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Daging
              </Link>
              <Link
                href="/seafood"
                onClick={closeDropdown}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Seafood
              </Link>
              <Link
                href="/dairy"
                onClick={closeDropdown}
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
        {session?.user ? (
          <div className="relative">
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
              <Image
                src={profilePicture}
                onClick={toggleProfile}
                alt="Profile"
                width={500}
                height={500}
                className="w-full h-full object-cover"
                key={profilePicture}
              />
            </div>
            {isProfileOpen && (
              <div className="absolute right-0 bg-white shadow-lg rounded-md mt-2 w-48 z-10">
                <Link
                  href="/profile"
                  onClick={closeProfile}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-md"
                >
                  Profil
                </Link>
                <Link
                  href="/history"
                  onClick={closeProfile}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-md"
                >
                  Riwayat
                </Link>
                <Link
                  href="/"
                  onClick={() => signOut()}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-md"
                >
                  Keluar
                </Link>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login">
            <button>Masuk</button>
          </Link>
        )}
      </div>
      {isDropdownOpen && (
        <div className="fixed inset-0 z-0" onClick={closeDropdown}></div>
      )}
    </nav>
  );
};

export default Navbar;
