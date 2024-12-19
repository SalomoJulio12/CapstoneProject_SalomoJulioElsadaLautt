import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import ProductDetail from '../components/ProductDetail';
import { setProducts } from '../store/redux/actions'; // Import action untuk menyimpan produk
import Swal from 'sweetalert2';

const ShopPage = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products); // Ambil produk dari Redux store
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [buyProduct, setBuyProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');

  // Memuat produk dari localStorage dan update di Redux saat pertama kali render
  useEffect(() => {
    const loadProducts = () => {
      const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
      dispatch(setProducts(storedProducts)); // Update Redux dengan produk yang ada di localStorage
      setFilteredProducts(storedProducts);
      const uniqueCategories = [...new Set(storedProducts.map((product) => product.category))];
      setCategories(uniqueCategories);
    };

    loadProducts();
  }, [dispatch]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === '') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((product) => product.category === category));
    }
  };

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(
      (item) => item.id === product.id && item.size === size
    );

    if (existingProductIndex !== -1) {
      // Jika produk dengan ukuran yang sama sudah ada, hanya tambah quantity
      if (cart[existingProductIndex].quantity < product.stock) {
        cart[existingProductIndex].quantity += 1;
      } else {
        Swal.fire({
          title: 'Out of Stock!',
          text: 'You have reached the maximum stock for this product.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } else {
      // Jika produk belum ada, tambah produk baru ke cart
      cart.push({ ...product, quantity: 1, size });
    }

    // Update cart di localStorage (stok tidak berubah)
    localStorage.setItem('cart', JSON.stringify(cart));

    Swal.fire({
      title: 'Added to Cart!',
      text: `${product.title} has been added to your cart.`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });

    setSize('');
    setQuantity(1);
  };

  const handleBuyNow = () => {
    Swal.fire({
      title: 'Confirm Purchase',
      text: `Do you want to buy ${buyProduct.title}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Buy Now',
    }).then((result) => {
      if (result.isConfirmed) {
        handleAddToCart(buyProduct);
        setBuyProduct(null); // Tutup modal Buy Now
        Swal.fire({
          title: 'Purchase Successful',
          text: 'Product has been added to your cart.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex">
        {/* Sidebar Filter */}
        <div className="w-1/4 p-4">
          <h2 className="text-xl font-bold mb-4">Filters</h2>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Daftar Produk */}
        <div className="w-3/4">
          <h1 className="text-3xl font-bold text-center mb-8">Products</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                openModal={() => setSelectedProduct(product)} // Buka modal untuk detail produk
                addToCart={(p) => handleAddToCart(p)} // Dikirimkan fungsi handleAddToCart
                isLoggedIn={isLoggedIn}
                onBuyNow={() => {
                  if (isLoggedIn) {
                    setBuyProduct(product); // Menampilkan modal Buy Now
                  } else {
                    Swal.fire({
                      title: 'You need to log in!',
                      text: 'Please log in to buy this product.',
                      icon: 'warning',
                      confirmButtonText: 'Go to Login',
                    }).then(() => {
                      window.location.href = '/login'; // Arahkan ke halaman login
                    });
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal untuk ProductDetail */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)} // Tutup modal
        />
      )}

      {/* Modal untuk Buy Now */}
      {buyProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-2/3 lg:w-1/2 relative">
            <h2 className="text-2xl font-bold mb-4">{buyProduct.title}</h2>
            <p className="text-lg font-semibold text-gray-800 mb-2">${buyProduct.price}</p>
            <button
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800"
              onClick={handleBuyNow}
            >
              Confirm Purchase
            </button>
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black text-lg"
              onClick={() => setBuyProduct(null)} // Tutup modal
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;