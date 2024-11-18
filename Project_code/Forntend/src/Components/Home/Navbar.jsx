import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-indigo-800 p-2 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1>
          <Link to="/">
            <img src="/yourbank logo.png" alt="YourBank Logo" className="h-16 rounded" />
          </Link>
        </h1>
        <h1 className="text-white text-2xl font-bold">Welcome to YourBank</h1>
        <div className="space-x-4">
          <Link
            to="/about"
            className="text-white text-xl hover:bg-blue-500 hover:text-white px-3 py-2 rounded transition duration-300"
          >
            About Us
          </Link>
          <Link
            to="/services"
            className="text-white text-xl hover:bg-blue-500 hover:text-white px-3 py-2 rounded transition duration-300"
          >
            Services
          </Link>
          <Link
            to="/admin"
            className="text-white text-xl hover:bg-blue-500 hover:text-white px-3 py-2 rounded transition duration-300"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
