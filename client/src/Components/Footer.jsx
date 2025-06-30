import React from "react";

function Footer() {
  return (
    <div
      className="relative h-64 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
      }}
    >
      <div className="absolute inset-0 bg-stone-900/80"></div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your Vision?
          </h3>
          <button
            onClick={() => (window.location.href = "/contact-us")}
            className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold px-8 py-3 rounded-lg transition-colors duration-300"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}

export default Footer;
