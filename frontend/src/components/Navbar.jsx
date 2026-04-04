import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion'; // Smooth mobile menu ke liye

// ==========================================
// NAVBAR COMPONENT: Website ki Top Menu Bar
// ==========================================
const Navbar = () => {
  // 1. Mobile Menu State (Open/Close track karne ke liye)
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    // 'sticky top-0 z-50' se Navbar hamesha screen ke top par chipki rahegi
    <nav className="flex justify-between items-center py-5 px-6 md:px-10 bg-white shadow-md sticky top-0 z-50">
      
      {/* ------------------------------------------
          LOGO SECTION
      ------------------------------------------ */}
      <div className="text-xl md:text-2xl font-extrabold text-blue-900 cursor-pointer transition transform hover:scale-105">
        <a href="#home">Knowledge Zenith Earth 🌎</a>
      </div>

      {/* ------------------------------------------
          DESKTOP MENU (Bade screens par dikhega)
      ------------------------------------------ */}
      <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
        <li><a href="#home" className="hover:text-blue-600 transition">Home</a></li>
        <li><a href="#about" className="hover:text-blue-600 transition">About</a></li>
        <li><a href="#programs" className="hover:text-blue-600 transition">Our Programs</a></li>
        <li><a href="#feedback" className="hover:text-blue-600 transition">Client Reviews</a></li>
      </ul>

      {/* ------------------------------------------
          MOBILE BUTTON (Sirf mobile par dikhega)
      ------------------------------------------ */}
      <div className="md:hidden">
        <button 
          onClick={toggleMenu} 
          className="text-gray-900 focus:outline-none text-2xl transition-transform duration-300"
        >
          {/* Menu open hai toh lal rang ka (X), warna Hamburger (☰) */}
          {isOpen ? <FaTimes className="text-red-500" /> : <FaBars />}
        </button>
      </div>

      {/* ------------------------------------------
          MOBILE DROPDOWN MENU
          Framer Motion ki madad se Smooth Slide-Down Animation
      ------------------------------------------ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} // Shuru mein thoda upar aur gayab
            animate={{ opacity: 1, y: 0 }}   // Phir apni sahi jagah par aayega
            exit={{ opacity: 0, y: -20 }}    // Band hone par wapas upar jayega
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 md:hidden"
          >
            <ul className="flex flex-col text-gray-800 font-medium py-2 px-4 space-y-2 text-center">
              {/* Jab koi link par click kare, toh menu automatically close ho jaye */}
              <li><a href="#home" onClick={toggleMenu} className="block py-3 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">Home</a></li>
              <li><a href="#about" onClick={toggleMenu} className="block py-3 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">About</a></li>
              <li><a href="#programs" onClick={toggleMenu} className="block py-3 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">Our Programs</a></li>
              <li><a href="#feedback" onClick={toggleMenu} className="block py-3 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">Client Reviews</a></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      
    </nav>
  );
};

export default Navbar;