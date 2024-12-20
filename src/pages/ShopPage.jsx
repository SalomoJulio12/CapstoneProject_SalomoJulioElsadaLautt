import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import ProductDetail from '../components/ProductDetail';
import { setProducts } from '../store/redux/actions';
import Swal from 'sweetalert2';

const ShopPage = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [size, setSize] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://fakestoreapi.com';

  // Fungsi untuk menghasilkan stok acak untuk setiap produk
  const generateRandomStock = () => Math.floor(Math.random() * 20) + 1;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProducts = JSON.parse(localStorage.getItem('products')); // Cek produk yang tersimpan di localStorage
      if (storedProducts && storedProducts.length > 0) {
        // Jika produk ada di localStorage, gunakan data tersebut dan update Redux store
        dispatch(setProducts(storedProducts));
        setFilteredProducts(storedProducts); // Filter produk sesuai kategori jika diperlukan
        const uniqueCategories = [...new Set(storedProducts.map((product) => product.category))];
        setCategories(uniqueCategories);
      } else {
        loadProductsFromAPI();
      }
    }
  }, [dispatch]);

  // Fungsi untuk memuat produk dari API
  const loadProductsFromAPI = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/products`);
      const data = await response.json();

      // Menambahkan stok acak ke setiap produk yang diterima dari API
      const updatedProducts = data.map((product) => ({
        ...product,
        stock: generateRandomStock(),
      }));

      console.log("Produk setelah ditambahkan stok:", updatedProducts);

      // Menyimpan produk yang dimuat ke localStorage dan Redux
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      dispatch(setProducts(updatedProducts));
      setFilteredProducts(updatedProducts);

      // Menyaring kategori unik dari produk
      const uniqueCategories = [...new Set(updatedProducts.map((product) => product.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to load products:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load products from the server.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  // Fungsi untuk mengubah kategori yang dipilih
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === '') {
      setFilteredProducts(products); // Tampilkan semua produk jika kategori tidak dipilih
    } else {
      // Filter produk berdasarkan kategori yang dipilih
      setFilteredProducts(products.filter((product) => product.category === category));
    }
  };

  // Fungsi untuk menambahkan produk ke keranjang belanja
  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || []; // Ambil data keranjang dari localStorage atau buat array kosong
    const existingProductIndex = cart.findIndex(
      (item) => item.id === product.id && item.size === size // Cek apakah produk sudah ada di keranjang
    );

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1; // Tambahkan jumlah jika produk sudah ada di keranjang
    } else {
      cart.push({ ...product, quantity: 1, size }); // Tambahkan produk ke keranjang jika belum ada
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    Swal.fire({
      title: 'Added to Cart!',
      text: `${product.title} has been added to your cart.`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });

    setSize('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex">
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
        <div className="w-3/4">
          <h1 className="text-3xl font-bold text-center mb-8">Products</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                openModal={() => setSelectedProduct(product)}
                addToCart={(p) => handleAddToCart(p)}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Detail Produk */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default ShopPage;