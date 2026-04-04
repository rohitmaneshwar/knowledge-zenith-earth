import React from 'react';
import { FaInstagram, FaFacebook, FaYoutube, FaWhatsapp } from "react-icons/fa";

// ==========================================
// FOOTER COMPONENT: Website ka sabse neeche ka hissa
// ==========================================
const Footer = () => {
  // ------------------------------------------
  // WHATSAPP SETTINGS
  // ------------------------------------------
  // Apna asli WhatsApp number yahan dalein (Country code 91 ke sath, bina + ya space ke)
  const whatsappNumber = "918120803877"; 
  
  // Jab koi WhatsApp button dabayega, toh ye message pehle se type hokar aayega
  const whatsappMessage = "Hello Omkar, I want to know more about your programs!";
  
  // WhatsApp API Link Generator
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6 border-t-4 border-blue-600" id="footer">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* ------------------------------------------
            COLUMN 1: BRAND INFO
            Aapki website ka naam aur short description
        ------------------------------------------ */}
        <div className="space-y-4">
          <h2 className="text-2xl font-extrabold text-white">Knowledge Zenith Earth 🌎</h2>
          <p className="text-gray-400 leading-relaxed text-sm">
            Empowering individuals to manifest their dream lives using the Law of Attraction, subconscious programming, and universal energy.
          </p>
        </div>

        {/* ------------------------------------------
            COLUMN 2: QUICK LINKS
            Website ke alag-alag hisso me direct jane ke raste
        ------------------------------------------ */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-3">
            <li><a href="#home" className="hover:text-blue-400 transition flex items-center gap-2">➔ Home</a></li>
            <li><a href="#about" className="hover:text-blue-400 transition flex items-center gap-2">➔ About Omkar</a></li>
            <li><a href="#programs" className="hover:text-blue-400 transition flex items-center gap-2">➔ Our Programs</a></li>
            <li><a href="#feedback" className="hover:text-blue-400 transition flex items-center gap-2">➔ Client Reviews</a></li>
          </ul>
        </div>

        {/* ------------------------------------------
            COLUMN 3: SOCIAL MEDIA & WHATSAPP
            Instagram, Facebook, Youtube aur Direct WhatsApp Chat
        ------------------------------------------ */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">Connect With Us</h3>
          
          {/* Social Media Icons */}
          <div className="flex gap-4 mb-6">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition duration-300 text-xl">
              <FaInstagram />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition duration-300 text-xl">
              <FaFacebook />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition duration-300 text-xl">
              <FaYoutube />
            </a>
          </div>

          {/* Direct WhatsApp Action Button */}
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-lg"
          >
            <FaWhatsapp className="text-2xl" />
            Chat on WhatsApp
          </a>
        </div>

      </div>

      {/* ------------------------------------------
          BOTTOM BAR: COPYRIGHT & DEVELOPER CREDIT
      ------------------------------------------ */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-800 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Dynamic Year (Apne aap har saal update hoga) */}
        <p>© {new Date().getFullYear()} Knowledge Zenith Earth. All rights reserved.</p>
        
        {/* Developer Credit */}
        <p>Built by <span className="font-semibold text-gray-400">Rohit Maneshwar</span></p> 
      </div>
    </footer>
  );
};

export default Footer;