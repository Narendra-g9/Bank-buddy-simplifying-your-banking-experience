import React from "react";

const AboutUs = () => {
  return (
    <div>
      <div className="sm:flex items-center max-w-screen-xl">
        <div className="sm:w-1/2 p-10">
          <div className="image object-center text-center">
            <img src="https://i.imgur.com/WbQnbas.png" alt="About Us" />
          </div>
        </div>
        <div className="sm:w-1/2 p-5">
          <div className="text">
            <span className="text-gray-500 border-b-2 border-indigo-600 uppercase">
              About us
            </span>
            <h2 className="my-4 font-bold text-3xl sm:text-4xl">
              About <span className="text-indigo-600">YourBank</span>
            </h2>
            <p className="text-gray-700">
              Welcome to YourBank, where we prioritize your financial well-being
              and success. With over 10 years of experience in the banking
              industry, we offer a comprehensive range of financial products and
              services tailored to meet the unique needs of individuals,
              businesses, and communities.
            </p>
            <p className="text-gray-700 my-3">
              Our mission is to empower our customers by providing innovative
              and accessible banking solutions, ensuring that you can manage
              your finances with ease, security, and confidence. At YourBank, we
              believe in building lasting relationships based on trust,
              transparency, and a commitment to excellent customer service.
            </p>
            <p className="text-gray-700">
              At YourBank, our vision is to foster financial inclusion by
              creating opportunities for everyone, regardless of their financial
              background. We are constantly innovating to provide cutting-edge
              financial services that simplify your banking experience and
              support your growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
