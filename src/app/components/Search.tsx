import React from 'react';

const Search: React.FC = () => {
    return (
        <div className="mt-4 flex justify-center">
            <input
                type="text"
                placeholder="Cari produk..."
                className="w-1/2 border border-gray-300 p-2 rounded-md focus:outline-none focus:border-green-600"
            />
            <button className="ml-2 bg-green-600 text-white px-4 py-2 rounded-md">
                Search
            </button>
        </div>
    );
};

export default Search;
