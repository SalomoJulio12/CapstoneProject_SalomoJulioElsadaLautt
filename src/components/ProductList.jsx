import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const ProductList = () => {
  // State untuk menyimpan data produk
  const [products, setProducts] = useState([]); // Inisialisasi state produk sebagai array kosong

  // Menggunakan useEffect untuk mengambil data produk dari API saat komponen pertama kali di-render
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;