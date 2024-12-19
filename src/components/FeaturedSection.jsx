// src/components/FeaturedSection.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroImage from "../assets/images/HeroImage.png";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa"; // Import icons

const FeaturedSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-[450px] w-full"
        style={{ backgroundImage: "url(/path-to-your-image.jpg)" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10">
          <div className="w-full px-4 h-full flex flex-col sm:flex-row items-center justify-between text-white">
            {/* Left Side of the Hero Section (Text) */}
            <div className="w-full sm:w-1/2 text-left space-y-6 ml-4 sm:ml-8 text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mt-6 sm:mt-0">
                <span className="block">Discover Fashion,</span>
                <span className="block">Tech, and More</span>
                <span className="block text-4xl md:text-5xl">Only Here</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300">
                From the latest trends in clothing to cutting-edge electronics,
                we bring you the best products that elevate your style and
                enhance your lifestyle, all in one place. Shop now and find
                exactly what you’re looking for, with unbeatable quality and
                variety!
              </p>
              {/* Shop Now Button */}
              <div className="text-center sm:text-left">
                <Link
                  to="/shop"
                  className="inline-block bg-black hover:bg-gray-800 text-white px-6 sm:px-8 py-3 rounded-full text-sm sm:text-lg transform transition duration-300 ease-in-out hover:scale-105"
                >
                  Shop Now
                </Link>
              </div>
            </div>

            {/* Right Side of the Hero Section (Image) */}
            <div className="hidden sm:block w-full sm:w-1/2 mx-auto object-center justify-items-center mt-6 sm:mt-0">
              <img
                src={HeroImage}
                alt="Hero Image"
                className="w-[240px] sm:w-[290px] md:w-[320px] h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div id="shop-now" className="container mx-auto px-4 py-12">
        <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Best Products
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow-lg">
              {/* Image */}
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-contain rounded-md mb-4" // Menggunakan object-contain
              />
              <h4 className="text-xl font-semibold mb-2">{product.title}</h4>
              <p className="text-gray-700 mb-4">
                {product.description.slice(0, 100)}...
              </p>
              <p className="font-bold text-blue-600">${product.price}</p>
              <a
                href="#shop-now"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full mt-4"
              >
                Buy Now
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* About Us Section */}
      <div id="about" className="container mx-auto px-4 py-12 bg-gray-100">
        <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          About Us
        </h3>
        <div className="text-lg text-center mb-6">
          <p>
            We are a dedicated team committed to bringing you the best products
            at the best prices. Our mission is to make shopping easy and
            enjoyable, with a focus on quality and customer satisfaction.
            Explore our amazing collections today and experience the difference!
          </p>
        </div>
        <div className="flex justify-center">
          <div className="w-64 h-64 flex items-center justify-center text-4xl sm:text-5xl font-bold text-blue-600">
            BestProduct.CO
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">
              Stay up to date about our latest offers
            </h3>
            <div className="flex justify-center mb-6">
              <input
                type="email"
                className="px-4 py-2 w-1/3 text-gray-800 rounded-l-md"
                placeholder="Enter your email address"
              />
              <button className="bg-black text-white px-6 py-2 rounded-r-md hover:bg-gray-700">
                Subscribe to Newsletter
              </button>
            </div>
          </div>

          {/* Footer links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 mb-6 text-sm text-gray-300">
            <div>
              <h4 className="font-semibold text-white mb-2">Company</h4>
              <ul>
                <li>
                  <Link to="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Works
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Career
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Help</h4>
              <ul>
                <li>
                  <Link to="#" className="hover:text-white">
                    Customer Support
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Delivery Details
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">FAQ</h4>
              <ul>
                <li>
                  <Link to="#" className="hover:text-white">
                    Account
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Manage Deliveries
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Orders
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Payments
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Resources</h4>
              <ul>
                <li>
                  <Link to="#" className="hover:text-white">
                    Free eBooks
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Development Tutorial
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    How to - Blog
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white">
                    Youtube Playlist
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social media icons */}
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="text-gray-400 hover:text-white">
              <FaFacebookF size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaTwitter size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaInstagram size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaLinkedinIn size={24} />
            </a>
          </div>

          <div className="text-sm text-gray-400">
            <p>&copy; 2000-2024 Shop.co. All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeaturedSection;
