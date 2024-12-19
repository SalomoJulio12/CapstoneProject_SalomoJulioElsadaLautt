// src/components/Home.jsx
import React from 'react';
import FeaturedSection from './components/FeaturedSection';

const Home = () => {
  return (
    <div>
      {/* Bagian Hero/Home */}
      <div className="relative bg-cover bg-center h-[500px]" style={{ backgroundImage: 'url(/path-to-your-hero-image.jpg)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10">
          <div className="flex items-center justify-center h-full text-center text-white">
            <div className="space-y-4 px-4 md:px-16">
              <h1 className="text-5xl font-bold">Welcome to Our Store</h1>
              <p className="text-xl">Discover amazing products at great prices</p>
              <a href="#shop-now" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg">Shop Now</a>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <FeaturedSection />


      {/* Additional Content or Sections */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-6">Our Latest Offers</h2>
        {/* Additional content can go here */}
      </div>
    </div>
  );
};

export default Home;
