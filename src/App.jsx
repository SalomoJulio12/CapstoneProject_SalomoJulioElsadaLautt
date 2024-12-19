import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FeaturedSection from './components/FeaturedSection';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage'; // Import halaman cart baru

const App = () => {
  return (
    <Router>
      {/* Tampilkan Navbar hanya jika halaman bukan login */}
      <Routes>
        {/* Rute utama untuk aplikasi */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <FeaturedSection />
            </>
          }
        />
        <Route
          path="/shop"
          element={
            <>
              <Navbar />
              <ShopPage />
            </>
          }
        />
        <Route
          path="/product/:id"
          element={
            <>
              <Navbar />
              <ProductPage />
            </>
          }
        />
        <Route
          path="/cart"
          element={
            <>
              <Navbar />
              <CartPage />
            </>
          }
        />
        {/* Halaman Login tanpa Navbar */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;