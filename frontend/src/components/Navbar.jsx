import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaEnvelope, FaPhone } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const [isAuthOpen, setIsAuthOpen] = useState(false); 
  const [loggedInUser, setLoggedInUser] = useState(null); 
  
  // 🌟 Naya State: Profile Dropdown kholne ke liye
  const [showProfile, setShowProfile] = useState(false); 

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setLoggedInUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setLoggedInUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); 
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setShowProfile(false); // Logout hone par dropdown band kar do
    localStorage.removeItem('user');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="flex justify-between items-center py-5 px-6 md:px-10 bg-white shadow-md sticky top-0 z-50">
        
        <div className="text-xl md:text-2xl font-extrabold text-blue-900 cursor-pointer transition transform hover:scale-105">
          <a href="#home">Knowledge Zenith Earth 🌎</a>
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
          <li><a href="#home" className="hover:text-blue-600 transition">Home</a></li>
          <li><a href="#about" className="hover:text-blue-600 transition">About</a></li>
          <li><a href="#programs" className="hover:text-blue-600 transition">Programs</a></li>
          <li><a href="#feedback" className="hover:text-blue-600 transition">Reviews</a></li>
          
          {/* 🌟 DESKTOP PROFILE DROPDOWN 🌟 */}
          <li className="relative">
            {loggedInUser ? (
              <div>
                <button 
                  onClick={() => setShowProfile(!showProfile)} 
                  className="flex items-center gap-2 font-bold text-blue-900 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 hover:bg-blue-100 transition"
                >
                  <span>Hi, {loggedInUser.name.split(' ')[0]} 👋</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                {/* Profile Box (Jab click karenge tab khulega) */}
                <AnimatePresence>
                  {showProfile && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-5 z-50"
                    >
                      <div className="flex items-center gap-3 mb-4 border-b pb-4">
                        <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center text-xl font-bold">
                          {loggedInUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{loggedInUser.name}</h4>
                          <p className="text-xs text-gray-500">Student Account</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <p className="flex items-center gap-2"><FaEnvelope className="text-blue-500" /> {loggedInUser.email}</p>
                        {loggedInUser.phone && <p className="flex items-center gap-2"><FaPhone className="text-blue-500" /> {loggedInUser.phone}</p>}
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm text-blue-800">
                        <p><strong>Welcome back!</strong> 🌟<br/> Explore our courses and track your progress from here.</p>
                      </div>

                      <button 
                        onClick={handleLogout} 
                        className="w-full bg-red-50 text-red-600 font-bold py-2 rounded-lg hover:bg-red-100 transition"
                      >
                        Secure Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                
                <li className="pt-2 border-t border-gray-100">
                  {loggedInUser ? (
                    <div className="flex justify-between items-center py-3 px-2">
                      <span className="font-bold text-blue-900">Hi, {loggedInUser.name.split(' ')[0]}</span>
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

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
    </>
  );
};

export default Navbar;