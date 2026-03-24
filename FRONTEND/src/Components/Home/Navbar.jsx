import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-indigo-900 p-4 shadow-xl">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="text-white text-2xl font-bold">🏦 YourBank</div>
        </Link>
        <div className="flex gap-6 items-center">
          <Link
            to="/"
            className="text-white hover:text-blue-200 font-semibold transition duration-300"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-white hover:text-blue-200 font-semibold transition duration-300"
          >
            About Us
          </Link>
          <Link
            to="/services"
            className="text-white hover:text-blue-200 font-semibold transition duration-300"
          >
            Services
          </Link>
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/admin-login"
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded font-semibold transition duration-300"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
