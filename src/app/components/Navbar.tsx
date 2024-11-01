"use client"; // Tambahkan ini di baris pertama

import React, { useState } from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    return (
        <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
            <div className="flex items-center">
                <img src="/file.svg" alt="Logo" className="w-10 h-10 mr-2" />
                {/* Teks "Ladang" hijau dan "Lokal" hitam */}
                <span className="text-2xl font-semibold">
                    <span className="text-green-600">Ladang</span> <span className="text-black">Lokal</span>
                </span>
            </div>
            <div className="flex space-x-6">
                <Link href="/" className="text-gray-700 hover:text-green-600">Home</Link>
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="text-gray-700 hover:text-green-600 focus:outline-none"
                    >
                        Kategori
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute bg-white shadow-lg rounded-md mt-2 w-40 z-10">
                            <Link href="/sayur" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Sayur</Link>
                            <Link href="/buah" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Buah</Link>
                            <Link href="/daging" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Daging</Link>
                            <Link href="/seafood" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Seafood</Link>
                            <Link href="/dairy" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Dairy</Link>
                        </div>
                    )}
                </div>
                <Link href="/cart" className="text-gray-700 hover:text-green-600">Keranjang</Link>
                <Link href="/login" className="text-gray-700 hover:text-green-600">Sign In</Link>
            </div>
            {isDropdownOpen && (
                <div className="fixed inset-0 z-0" onClick={closeDropdown}></div>
            )}
        </nav>
    );
};

export default Navbar;
