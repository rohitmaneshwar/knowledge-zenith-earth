import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal'; // Dhyan dein: Agar AuthModal kisi aur folder mein hai toh path theek kar lein

// ==========================================
// NAVBAR COMPONENT: Website ki Top Menu Bar
// ==========================================
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile Menu ke liye
  const [isAuthOpen, setIsAuthOpen] = useState(false); // Login Popup ke liye
  const [loggedInUser, setLoggedInUser] = useState(null); // User ka data

  // Page load hone par check karein ki user pehle se login hai ya nahi
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setLoggedInUser(JSON.parse(savedUser));
    }
  }, []);

  // Login successful hone par
  const handleLoginSuccess = (userData) => {
    setLoggedInUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Browser mein save kar diya
  };

  // Logout karne par
  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('user');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="flex justify-between items-center py-5 px-6 md:px-10 bg-white shadow-md sticky top-0 z-50">
        
        {/* LOGO */}
        <div className="text-xl md:text-2xl font-extrabold text-blue-900 cursor-pointer transition transform hover:scale-105">
          <a href="#home">Knowledge Zenith Earth 🌎</a>
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
          <li><a href="#home" className="hover:text-blue-600 transition">Home</a></li>
          <li><a href="#about" className="hover:text-blue-600 transition">About</a></li>
          <li><a href="#programs" className="hover:text-blue-600 transition">Programs</a></li>
          <li><a href="#feedback" className="hover:text-blue-600 transition">Reviews</a></li>
          
          {/* 🌟 DESKTOP LOGIN / LOGOUT BUTTON 🌟 */}
          <li>
            {loggedInUser ? (
              <div className="flex items-center gap-3">
                <span className="font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full">
                  Hi, {loggedInUser.name.split(' ')[0]} 👋
                </span>
                <button onClick={handleLogout} className="text-red-500 font-bold hover:text-red-700">
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)} 
                className="bg-blue-900 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-800 transition"
              >
                Login / Sign Up
              </button>
            )}
          </li>
        </ul>

        {/* MOBILE BUTTON */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-900 focus:outline-none text-2xl transition-transform duration-300">
            {isOpen ? <FaTimes className="text-red-500" /> : <FaBars />}
          </button>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 md:hidden"
            >
              <ul className="flex flex-col text-gray-800 font-medium py-2 px-4 space-y-2 text-center">
                <li><a href="#home" onClick={toggleMenu} className="block py-3 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">Home</a></li>
                <li><a href="#about" onClick={toggleMenu} className="block py-3 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">About</a></li>
                <li><a href="#programs" onClick={toggleMenu} className="block py-3 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">Programs</a></li>
                <li><a href="#feedback" onClick={toggleMenu} className="block py-3 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">Reviews</a></li>
                
                {/* 🌟 MOBILE LOGIN / LOGOUT BUTTON 🌟 */}
                <li className="pt-2 border-t border-gray-100">
                  {loggedInUser ? (
                    <div className="flex justify-between items-center py-3 px-2">
                      <span className="font-bold text-blue-900">Hi, {loggedInUser.name}</span>
                      <button onClick={() => { handleLogout(); toggleMenu(); }} className="text-red-500 font-bold">
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { setIsAuthOpen(true); toggleMenu(); }} 
                      className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800"
                    >
                      Login / Sign Up
                    </button>
                  )}
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 🌟 AUTH MODAL (POPUP) RENDER 🌟 */}
      {/* Yeh code background mein rahega aur jab isAuthOpen true hoga tab screen par aayega */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
    </>
  );
};

export default Navbar;