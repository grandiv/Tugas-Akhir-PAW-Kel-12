import React from 'react';

interface ProductCardProps {
    imageUrl: string;
    name: string;
    price: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ imageUrl, name, price }) => {
    return (
        <div className="border rounded-lg shadow-sm p-4">
            <div className="h-40 bg-gray-200 mb-4">
                <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
            </div>
            <h3 className="font-semibold text-gray-700">{name}</h3>
            <p className="text-green-600 font-bold">Rp {price.toLocaleString()}</p>
            <button className="bg-green-600 text-white px-4 py-2 mt-2 rounded-md w-full">Tambah</button>
        </div>
    );
};

export default ProductCard;
