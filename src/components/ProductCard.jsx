import React from 'react';
import Swal from 'sweetalert2';

const ProductCard = ({ product, openModal, addToCart, isLoggedIn }) => {
  const { title, price, image, category, stock } = product;

  // Fungsi untuk menambahkan produk ke cart
  const handleAddToCart = () => {
    if (stock <= 0) {
      Swal.fire({
        title: 'Out of Stock!',
        text: 'This product is out of stock.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return; // Jangan tambahkan ke cart jika stok habis
    }

    if (category === "men's clothing" || category === "women's clothing") {
      // Jika kategori clothing, minta ukuran
      Swal.fire({
        title: 'Size Required!',
        text: 'Please select a size in the product details before adding to the cart.',
        icon: 'info',
        confirmButtonText: 'OK',
      });
    } else {
      // Jika kategori bukan clothing, langsung tambahkan ke cart
      addToCart(product);
    }
  };

  // Fungsi aksi jika tombol View Detail atau Add to Cart di klik
  const handleAction = (action) => {
    if (!isLoggedIn) {
      Swal.fire({
        title: 'You need to log in!',
        text: 'Please log in to view details or buy this product.',
        icon: 'warning',
        confirmButtonText: 'Go to Login',
      }).then(() => {
        window.location.href = '/login'; // Arahkan ke halaman login
      });
    } else {
      if (action === 'view') {
        openModal(); // Buka modal untuk View Detail
      } else if (action === 'addToCart') {
        handleAddToCart(); // Buka modal untuk Add to Cart (akan ditangani di ShopPage)
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Gambar Produk */}
      <img src={image} alt={title} className="w-full h-48 sm:h-56 md:h-64 object-cover" />

      {/* Detail Produk */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{title}</h3>
        <p className="text-gray-600 font-bold mb-4">${price.toFixed(2)}</p>
        <p className="text-gray-600 mb-4">Stock Available: {product.stock}</p>

        {/* Tombol View Detail dan Add to Cart */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          <button
            className="w-full sm:w-1/2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 mb-4 sm:mb-0"
            onClick={() => handleAction('view')}
          >
            View Detail
          </button>
          <button
            className="w-full sm:w-1/2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            onClick={() => handleAction('addToCart')}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;