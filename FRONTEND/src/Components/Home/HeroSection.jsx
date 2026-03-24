import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col justify-center items-center px-6 py-20">
      <div className="max-w-4xl text-center">
        <h2 className="text-6xl lg:text-7xl font-bold text-white mb-4">
          Welcome to YourBank
        </h2>
        <p className="text-xl lg:text-2xl text-blue-100 mb-8">
          A bank that cares for you
        </p>
        <p className="text-lg text-blue-50 mb-12 max-w-2xl mx-auto">
          Secure, reliable, and trusted banking solutions for your financial needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="bg-white text-indigo-600 hover:bg-blue-50 font-semibold rounded-lg px-8 py-4 transition duration-200 text-lg"
          >
            Customer Login
          </Link>
          <Link
            to="/admin-login"
            className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold rounded-lg px-8 py-4 transition duration-200 text-lg"
          >
            Admin Login
          </Link>
          <Link
            to="/register"
            className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-semibold rounded-lg px-8 py-4 transition duration-200 text-lg"
          >
            Create Account
          </Link>
        </div>
      </div>
      
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <div className="bg-white bg-opacity-10 rounded-lg p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">🔒 Secure</h3>
          <p>Bank-level security for your peace of mind</p>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">⚡ Fast</h3>
          <p>Instant transactions and quick approvals</p>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">📱 Accessible</h3>
          <p>Access your account anytime, anywhere</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
