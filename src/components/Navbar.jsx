import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/redux/actions';
import { FaShoppingCart, FaUserCircle, FaBars, FaSearch, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Function to update cart item count
  const updateCartItemCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const uniqueProducts = new Set(cart.map(item => `${item.id}-${item.size || ''}`)); 
    setCartItemCount(uniqueProducts.size); // Count unique products by ID + size
  };

  // Initially set the cart count
  useEffect(() => {
    updateCartItemCount();
  }, []);

  // Whenever the cart changes, we need to update the cart count
  useEffect(() => {
    const handleStorageChange = () => {
      updateCartItemCount(); // Update cart count on localStorage change
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleUserClick = () => {
    if (!isLoggedIn) {
      Swal.fire({
        title: 'You are not logged in!',
        text: 'You will be redirected to the login page.',
        icon: 'info',
        confirmButtonText: 'Go to Login',
      }).then(() => {
        navigate('/login');
      });
    } else {
      Swal.fire({
        title: 'Hello!',
        text: `Welcome back, ${user.username}!`,
        icon: 'success',
        confirmButtonText: 'Close',
      });
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        Swal.fire({
          title: 'Logged out successfully!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate('/');
        });
      }
    });
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between relative">
        {/* Logo */}
        <h1 className="font-bold text-xl">BestProduct.CO</h1>

        {/* Menu - Desktop */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/shop" className="text-gray-700 hover:text-blue-600">Shop</Link>
          <Link to="/#about" className="text-gray-700 hover:text-blue-600">About Us</Link>
          
          {/* Search Bar */}
          <div className="relative hidden md:block flex-1 max-w-[500px]">
            <input
              type="text"
              placeholder="Search for products..."
              className="rounded-full py-2 px-4 pl-10 w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-600" />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          {isLoggedIn && (
            <Link to="/cart" className="text-gray-700 hover:text-blue-600 relative">
              <FaShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 text-xs font-bold text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          )}

          {/* User Icon */}
          <button
            className="text-gray-700 hover:text-blue-600 flex items-center"
            onClick={handleUserClick}
          >
            <FaUserCircle className="h-6 w-6" />
            {isLoggedIn && <span className="ml-2">{user.username}</span>}
          </button>

          {/* Logout Button */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-600 flex items-center"
            >
              <FaSignOutAlt className="h-6 w-6" />
              <span className="ml-2">Logout</span>
            </button>
          )}

          {/* Mobile Menu */}
          <button onClick={toggleMobileMenu} className="text-gray-700 md:hidden">
            <FaBars className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu - Toggle visibility when menu is open */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md absolute top-0 left-0 w-full max-h-[calc(100vh-4rem)] overflow-y-auto flex flex-col items-center pt-16 z-50">
          {/* Close Button (X) */}
          <button
            className="absolute top-4 right-4 text-gray-700"
            onClick={toggleMobileMenu}
          >
            <FaTimes className="h-6 w-6" />
          </button>

          <Link to="/" className="py-2 text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/shop" className="py-2 text-gray-700 hover:text-blue-600">Shop</Link>
          <Link to="/#about" className="py-2 text-gray-700 hover:text-blue-600">About Us</Link>

          {isLoggedIn && (
            <>
              <Link to="/cart" className="py-2 text-gray-700 hover:text-blue-600 flex items-center">
                <FaShoppingCart className="mr-2" />
                Cart
              </Link>
              <button
                onClick={handleLogout}
                className="py-2 text-gray-700 hover:text-red-600 flex items-center"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </>
          )}

          {/* Search Bar in Mobile */}
          <div className="relative my-4 w-full max-w-[300px]">
            <input
              type="text"
              placeholder="Search for products..."
              className="rounded-full py-2 px-4 pl-10 w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-600" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;