import React, { useState, useRef, useEffect } from "react";

interface SortProps {
  onSortChange: (order: "asc" | "desc") => void;
}

const Sort: React.FC<SortProps> = ({ onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Handle click outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle sorting option selection
  const handleSortSelection = (order: "asc" | "desc") => {
    onSortChange(order);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        style={{ backgroundColor: "#0b9343" }}
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-white text-sm font-medium hover:bg-opacity-90 focus:outline-none"
      >
        Urutkan
      </button>

      {isOpen && (
        <div
          className="absolute mt-2 w-44 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          style={{ backgroundColor: "#0b9343" }}
          role="menu"
          aria-orientation="vertical"
        >
          <button
            onClick={() => handleSortSelection("asc")}
            className="text-white block px-4 py-2 text-sm hover:bg-opacity-90 w-full text-left"
            role="menuitem"
          >
            Harga Terendah
          </button>
          <button
            onClick={() => handleSortSelection("desc")}
            className="text-white block px-4 py-2 text-sm hover:bg-opacity-90 w-full text-left"
            role="menuitem"
          >
            Harga Tertinggi
          </button>
        </div>
      )}
    </div>
  );
};

export default Sort;
