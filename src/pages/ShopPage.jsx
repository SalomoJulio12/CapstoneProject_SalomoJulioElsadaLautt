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

  // Default API URL jika environment variables tidak tersedia
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://fakestoreapi.com';

  useEffect(() => {
    // Memeriksa apakah kode dijalankan di browser (klien)
    if (typeof window !== "undefined") {
      const storedProducts = JSON.parse(localStorage.getItem('products'));
      if (storedProducts && storedProducts.length > 0) {
        dispatch(setProducts(storedProducts)); // Update Redux dengan produk dari localStorage
        setFilteredProducts(storedProducts);
        const uniqueCategories = [...new Set(storedProducts.map((product) => product.category))];
        setCategories(uniqueCategories);
        console.log('Produk dari localStorage:', storedProducts); // Log produk yang diambil dari localStorage
      } else {
        loadProductsFromAPI(); // Fetch dari API jika localStorage kosong
      }
    }
  }, [apiBaseUrl, dispatch]);

  // Memuat produk dari API jika localStorage kosong
  const loadProductsFromAPI = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/products`);
      const data = await response.json();
      
      // Menambahkan stok default ke setiap produk
      const updatedProducts = data.map((product) => ({
        ...product,
        stock: 10, // Stok default 10 untuk setiap produk
      }));

      // Log untuk memeriksa produk yang sudah di-update
      console.log('Produk dengan stok:', updatedProducts);

      // Simpan ke localStorage dan Redux
      localStorage.setItem('products', JSON.stringify(updatedProducts));

      // Log untuk memeriksa apakah produk sudah berhasil disimpan di localStorage
      console.log('Produk setelah disimpan di localStorage:', localStorage.getItem('products'));

      dispatch(setProducts(updatedProducts)); // Update Redux dengan data produk yang sudah diupdate stoknya
      setFilteredProducts(updatedProducts);

      // Ambil kategori unik
      const uniqueCategories = [...new Set(updatedProducts.map((product) => product.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading products:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load products from the server.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === '') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((product) => product.category === category));
    }
  };

  const handleAddToCart = (product) => {
    if (!product.stock || product.stock <= 0) {
      Swal.fire({
        title: 'Out of Stock!',
        text: 'This product is out of stock.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return; // Jangan tambahkan ke cart jika stok habis
    }

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

    // Update cart di localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update stok produk di localStorage
    const updatedProducts = [...products];
    const productIndex = updatedProducts.findIndex((p) => p.id === product.id);
    if (productIndex !== -1) {
      updatedProducts[productIndex].stock -= 1; // Mengurangi stok
    }
    localStorage.setItem('products', JSON.stringify(updatedProducts)); // Update stok produk di localStorage

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
    if (!buyProduct || buyProduct.stock <= 0) {
      Swal.fire({
        title: 'Out of Stock!',
        text: 'This product is out of stock.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return; // Jangan lanjutkan jika stok habis
    }

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