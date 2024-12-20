import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setProducts } from '../store/redux/actions';

const ProductPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch(); // Hook untuk mengirim action Redux
  const products = useSelector((state) => state.products); // Mengambil daftar produk dari Redux state

  useEffect(() => {
    if (products.length === 0) { // Cek apakah produk belum tersedia
      const fetchProducts = async () => {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        dispatch(setProducts(data));
      };
      fetchProducts();
    }
  }, [dispatch, products.length]);

  // Temukan produk berdasarkan productId
  const product = products.find((p) => p.id === Number(productId));

  if (!product) return <div className="text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row">
        {/* Gambar Produk */}
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Detail Produk */}
        <div className="lg:w-1/2 lg:pl-12">
          <h1 className="text-3xl sm:text-4xl font-bold">{product.title}</h1>
          <p className="text-xl sm:text-2xl text-gray-600 mt-2">${product.price}</p>
          <p className="text-lg sm:text-xl text-gray-800 mt-4">{product.description}</p>

          <div className="mt-6">
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 w-full sm:w-auto"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;