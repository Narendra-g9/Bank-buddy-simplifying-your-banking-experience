import React from 'react';

const ContactUs = () => {
  return (
    <div>
      <div className="bg-white">
        <header className="bg-gradient-to-r from-blue-300 to-violet-500 text-white text-center py-12">
          <h1 className="text-4xl font-bold mt-16">Contact Us</h1>
        </header>
        <section className="text-center py-12 px-4">
          <h2 className="text-2xl font-bold">Get In Touch</h2>
          <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
            We are here to help you. Reach out to us via any of the following methods.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8 animate-fadeIn">
            <div className="p-4 shadow-lg rounded-lg bg-green-100 hover:bg-green-200 transition-colors">
              <h3 className="text-xl font-bold">Call Us</h3>
              <p className="text-gray-700 mt-2">+1 123 456 7890</p>
            </div>
            <div className="p-4 shadow-lg rounded-lg bg-green-100 hover:bg-green-200 transition-colors">
              <h3 className="text-xl font-bold">Email Us</h3>
              <p className="text-gray-700 mt-2">contact@bank.com</p>
            </div>
            <div className="p-4 shadow-lg rounded-lg bg-green-100 hover:bg-green-200 transition-colors">
              <h3 className="text-xl font-bold">Visit Us</h3>
              <p className="text-gray-700 mt-2">123 bank St, Bank City</p>
            </div>
          </div>
        </section>
        {/* Uncomment this section if you need the contact form */}
        {/* 
        <section className="bg-gray-100 py-12 px-4">
          <h2 className="text-2xl font-bold text-center">Send Us A Message</h2>
          <form className="max-w-2xl mx-auto mt-8 space-y-8">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-bold">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full mt-2 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-bold">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full mt-2 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 font-bold">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full mt-2 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                defaultValue={""}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-lg shadow-lg hover:bg-green-600 transition-colors"
            >
              Send Message
            </button>
          </form>
        </section>
        */}
      </div>
    </div>
  );
};

export default ContactUs;
