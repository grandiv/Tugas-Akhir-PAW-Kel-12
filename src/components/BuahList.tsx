'use client'
import { useSearch } from "@/context/SearchContext";
import ProductCard from "./ProductCard";

const buahProduct = [
    { imageUrl: "/sayur/1.png", name: "Kol Merah", price: 20000 },
    { imageUrl: "/sayur/2.png", name: "Kangkung", price: 10000 },
    { imageUrl: "/sayur/3.png", name: "Sawi", price: 8000 },
    { imageUrl: "/sayur/4.png", name: "Pare 400gr", price: 10000 },
    { imageUrl: "/sayur/5.png", name: "Bayam 400gr", price: 20000 },
    { imageUrl: "/sayur/6.png", name: "Ubi 500gr", price: 20000 },
    { imageUrl: "/sayur/7.png", name: "Brokoli 400gr", price: 30999 },
    { imageUrl: "/sayur/8.png", name: "Buncis 400gr", price: 10900 },
    { imageUrl: "/sayur/9.png", name: "Wortel 400gr", price: 10000 },
];

export default function BuahList(){
    const { searchTerm } = useSearch();

    const filteredProducts = buahProduct.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return(
        <>
        <p className="text-left text-lg my-4 ml-6">
        Menampilkan dari <span className="font-bold">{filteredProducts.length} produk</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mx-6 gap-5 mb-11">
            {filteredProducts.map((product, index) => (
            <ProductCard
                key={index}
                imageUrl={product.imageUrl}
                name={product.name}
                price={product.price}
            />
            ))}
        </div>
        </>
    )
}