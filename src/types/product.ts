export interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category: "sayur" | "buah" | "daging" | "seafood" | "dairy";
  image: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInput {
  name: string;
  price: number;
  description?: string;
  category: "sayur" | "buah" | "daging" | "seafood" | "dairy";
  image?: string;
  stock?: number;
}
