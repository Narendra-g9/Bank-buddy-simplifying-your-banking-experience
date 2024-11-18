import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div>
      <div
        className="bg-[url('/2322548.jpg')] object-cover lg:min-h-screen bg-no-repeat"
        style={{
          backgroundImage: `url('/2322548.jpg')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="flex justify-center items-center">
          <div>
            <div
              className="hidden lg:block lg:w-1/2 bg-cover"
              style={{
                backgroundImage: `url('/2322548.jpg')`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            ></div>
            <div className="w-full px-6 md:py-16 lg:py-12 mt-40 bg-[#3b83f6e3] rounded-lg shadow-lg">
              <h2 className="text-5xl font-semibold text-yellow-300 text-center font-mono italic">
                Welcome to YourBank
              </h2>
              <p className="text-white text-center mt-2 text-2xl italic">
                A bank that cares for you
              </p>
              <div className="mt-4 flex justify-center">
                <Link
                  to="/login"
                  className="bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-700 text-white font-semibold rounded-lg px-4 py-3 transition duration-200 text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
