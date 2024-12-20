import React, { useState } from 'react';
import Swal from 'sweetalert2';

const ProductDetail = ({ product, onClose }) => {
  const { title, price, description, image, category, rating, stock } = product;
  // State untuk mengelola jumlah produk dan ukuran yang dipilih
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');

  // Fungsi untuk menambahkan produk ke keranjang
  const handleAddToCart = () => {
    if (size === '' && (category === "men's clothing" || category === "women's clothing")) {
      Swal.fire({
        title: 'Size is required!',
        text: 'Please select a size before adding to the cart.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    // Validasi jika jumlah produk melebihi stok yang tersedia
    if (quantity > stock) {
      Swal.fire({
        title: 'Not enough stock!',
        text: `Only ${stock} items available. Please reduce the quantity.`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    // Membuat objek produk untuk dimasukkan ke keranjang
    const cartItem = {
      ...product,
      quantity,
      size,
    };

    // Menyimpan produk ke Local Storage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.id === product.id && item.size === size);
    
    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += quantity; // Update quantity
    } else {
      cart.push(cartItem); // Tambah produk baru ke cart
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    Swal.fire({
      title: 'Item added to cart!',
      icon: 'success',
    });

    onClose(); // Close the modal
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-500">&#9733;</span>
        ))}
        {halfStar > 0 && <span className="text-yellow-500">&#189;</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">&#9733;</span>
        ))}
      </>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 md:w-2/3 lg:w-1/2 relative">
        {/* Tombol Close */}
        <button className="absolute top-4 right-4 text-gray-600 hover:text-black text-lg" onClick={onClose}>✖</button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Gambar Produk */}
          <div className="flex-shrink-0">
            <img src={image} alt={title} className="w-full md:w-64 h-auto rounded-md object-cover" />
          </div>

          {/* Detail Produk */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <p className="text-lg font-semibold text-gray-800 mb-2">${price}</p>
            <p className="text-gray-700 mb-6">{description}</p>

            {/* Rating Produk */}
            {rating && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Rating:</h3>
                <div className="flex items-center">
                  {renderStars(rating.rate)}
                  <span className="ml-2 text-gray-600">({rating.count} reviews)</span>
                </div>
              </div>
            )}

            {/* Ukuran */}
            {(category === "men's clothing" || category === "women's clothing") && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Choose Size:</h3>
                <div className="flex gap-2">
                  {['Small', 'Medium', 'Large', 'X-Large'].map((sizeOption) => (
                    <button
                      key={sizeOption}
                      onClick={() => setSize(sizeOption)}
                      className={`px-3 py-1 border rounded-md hover:bg-gray-200 ${size === sizeOption ? 'bg-gray-300' : ''}`}
                    >
                      {sizeOption}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-4">
              <button className="px-2 py-1 border rounded-md" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button className="px-2 py-1 border rounded-md" onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>

            <button className="bg-black text-white px-6 py-3 rounded-md mt-4 hover:bg-gray-800 w-full md:w-auto" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;