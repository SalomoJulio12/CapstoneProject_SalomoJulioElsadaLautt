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
  const [cart, setCart] = useState([]);
  const [size, setSize] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://fakestoreapi.com';

  // Fungsi untuk generate stok acak
  const generateRandomStock = () => Math.floor(Math.random() * 20) + 1;

  // Memuat produk saat komponen di-mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProducts = JSON.parse(localStorage.getItem('products'));
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      if (storedProducts && storedProducts.length > 0) {
        dispatch(setProducts(storedProducts));
        setFilteredProducts(storedProducts);
        setCart(storedCart);
        const uniqueCategories = [...new Set(storedProducts.map((product) => product.category))];
        setCategories(uniqueCategories);
      } else {
        loadProductsFromAPI();
      }
    }
  }, [dispatch]);

  // Fungsi untuk memuat produk dari API dan menambahkan stok
  const loadProductsFromAPI = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/products`);
      const data = await response.json();

      // Tambahkan properti stok
      const updatedProducts = data.map((product) => ({
        ...product,
        stock: generateRandomStock(),
      }));

      console.log("Produk setelah ditambahkan stok:", updatedProducts); // Debug

      // Simpan produk ke localStorage dan Redux
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      dispatch(setProducts(updatedProducts));
      setFilteredProducts(updatedProducts);

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

  // Mengubah kategori yang dipilih
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === '') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((product) => product.category === category));
    }
  };

  // Menambahkan produk ke keranjang
  const handleAddToCart = (product) => {
    const existingCart = [...cart];
    const existingProductIndex = existingCart.findIndex(
      (item) => item.id === product.id && item.size === size
    );

    if (existingProductIndex !== -1) {
      existingCart[existingProductIndex].quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1, size });
    }

    setCart(existingCart);
    localStorage.setItem('cart', JSON.stringify(existingCart)); // Simpan keranjang ke localStorage

    Swal.fire({
      title: 'Added to Cart!',
      text: `${product.title} has been added to your cart.`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });

    setSize('');
  };

  // Proses checkout
  const handleCheckout = () => {
    const updatedProducts = [...products];
    cart.forEach((cartItem) => {
      const productIndex = updatedProducts.findIndex((p) => p.id === cartItem.id);
      if (productIndex !== -1) {
        updatedProducts[productIndex].stock = Math.max(
          0,
          updatedProducts[productIndex].stock - cartItem.quantity
        );
      }
    });

    // Simpan produk yang diperbarui ke Redux dan localStorage
    dispatch(setProducts(updatedProducts));
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setCart([]); // Kosongkan keranjang
    localStorage.setItem('cart', JSON.stringify([])); // Kosongkan keranjang di localStorage

    Swal.fire({
      title: 'Checkout Successful!',
      text: 'Your order has been placed successfully.',
      icon: 'success',
      confirmButtonText: 'OK',
    });
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
    </div>
  );
};

export default ShopPage;