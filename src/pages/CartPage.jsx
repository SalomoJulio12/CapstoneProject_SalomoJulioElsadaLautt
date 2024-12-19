import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Import useDispatch untuk mengirim action updateStock
import { updateStock } from '../store/redux/actions'; // Import action updateStock

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate(); // Untuk redirect setelah checkout
  const dispatch = useDispatch(); // Deklarasi dispatch

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  }, []);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleQuantityChange = (id, size, delta, stock) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id && item.size === size
        ? {
            ...item,
            quantity: Math.max(1, Math.min(item.quantity + delta, stock)),
          }
        : item
    );

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update localStorage
  };

  const handleRemove = (id, size) => {
    const updatedCart = cartItems.filter((item) => !(item.id === id && item.size === size));
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update localStorage
  };

  const handleCheckout = () => {
    const updatedCart = [...cartItems];
    let insufficientStockItems = [];
    
    // Periksa stok dan update cart
    updatedCart.forEach((item) => {
      const productStock = JSON.parse(localStorage.getItem('products'));
      const productIndex = productStock.findIndex((product) => product.id === item.id);

      if (item.quantity > productStock[productIndex].stock) {
        insufficientStockItems.push(item);
        item.quantity = productStock[productIndex].stock; // Batasi sesuai stok
      }
    });

    // Simpan cart yang telah diperbarui ke localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Update stok di localStorage hanya setelah checkout
    let productStock = JSON.parse(localStorage.getItem('products'));
    updatedCart.forEach((item) => {
      const productIndex = productStock.findIndex((product) => product.id === item.id);
      // Kurangi stok sesuai dengan quantity yang dibeli hanya setelah checkout
      productStock[productIndex].stock -= item.quantity;
    });

    // Update Redux store dengan stok yang baru
    dispatch(updateStock(productStock));

    // Update localStorage dengan stok terbaru
    localStorage.setItem('products', JSON.stringify(productStock));

    // Menampilkan pesan jika ada produk dengan stok tidak cukup
    if (insufficientStockItems.length > 0) {
      const itemNames = insufficientStockItems.map((item) => item.title).join(', ');
      Swal.fire({
        title: 'Stock Not Sufficient',
        text: `The following items are not available in the requested quantity: ${itemNames}`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } else {
      Swal.fire({
        title: 'Proceeding with Checkout',
        text: 'Your order has been placed successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        // Setelah checkout selesai, hapus produk dari cart di localStorage
        localStorage.removeItem('cart');
        navigate('/'); // Arahkan ke halaman utama setelah checkout
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">YOUR CART</h2>
        <span className="text-xl font-bold text-gray-600">{cartItems.length} items</span>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item, index) => (
              <div key={`${item.id}-${item.size}-${index}`} className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center">
                  <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded mr-4" />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.size && <p className="text-gray-500 text-sm">Size: {item.size}</p>}
                    <p className="text-gray-900 font-bold mt-1">${item.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleQuantityChange(item.id, item.size, -1, item.stock)} className="w-6 h-6 border rounded text-gray-600">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, item.size, 1, item.stock)} className="w-6 h-6 border rounded text-gray-600">+</button>
                  <button onClick={() => handleRemove(item.id, item.size)} className="text-red-500 hover:text-red-700 ml-4">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-100 p-6 rounded-md mt-8">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${15}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4">
                <span>Total</span>
                <span>${(calculateSubtotal() + 15).toFixed(2)}</span>
              </div>
            </div>

            <button
              className="w-full bg-black text-white mt-6 py-3 rounded-md text-center hover:bg-gray-800"
              onClick={handleCheckout}
            >
              Go to Checkout →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;