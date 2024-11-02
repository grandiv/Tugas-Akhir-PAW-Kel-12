import React from "react";
import Layout from "../layout";
import ProductCard from "@/components/ProductCard";

const page = () => {
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-6 gap-5">
        <ProductCard
          imageUrl="/seafood/atlanticsalmon.jpeg"
          name="Atlantic Salmon Fillets"
          price={99000}
        />
        <ProductCard
          imageUrl="/seafood/rawshrimp.webp"
          name="Raw Shrimp, Peeled & Deveined"
          price={40000}
        />
        <ProductCard
          imageUrl="/seafood/3.jpg"
          name="Alaskan King Crab Legs"
          price={58000}
        />
        <ProductCard
          imageUrl="/seafood/4.jpg"
          name="Scallops, Wild Caught"
          price={69000}
        />
        <ProductCard
          imageUrl="/seafood/5.webp"
          name="Fresh Oysters (Dozen)"
          price={73000}
        />
        <ProductCard
          imageUrl="/seafood/6.jpeg"
          name="Lobster Tails"
          price={49000}
        />
        <ProductCard
          imageUrl="/seafood/7.jpg"
          name="Tilapia Fillets"
          price={50999}
        />
        <ProductCard
          imageUrl="/seafood/tunasteak.webp"
          name="Tuna Steaks"
          price={109000}
        />
        <ProductCard
          imageUrl="/seafood/9.jpg"
          name="Cod Fillets"
          price={89000}
        />
        <ProductCard
          imageUrl="/seafood/10.webp"
          name="Mussels, Fresh"
          price={74000}
        />
      </div>
      ;
    </Layout>
  );
};

export default page;
