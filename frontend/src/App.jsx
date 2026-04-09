import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Sabhi Components Import kar rahe hain
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Programs from './components/Programs';
import Testimonials from './components/Testimonials';
// import Register from './components/Register';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import { useState, useEffect } from 'react';
import AuthModal from './components/AuthModal'; // Path apne hisaab se theek kar lena

// ==========================================
// MAIN LAYOUT: Frontend Website
// ==========================================
const MainWebsite = () => (
  <div className="min-h-screen flex flex-col font-sans bg-white text-gray-900 scroll-smooth">
    <Navbar />
    <main className="flex-grow">
      <Hero />
      <About />
      <Programs />
      <Testimonials />
    </main>
    <Footer />
  </div>
);

// ==========================================
// APP ROUTER: Traffic Controller
// ==========================================
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Normal Website: user jab 'yourwebsite.com' kholega */}
        <Route path="/" element={<MainWebsite />} />
        
        {/* Admin Panel: user jab 'yourwebsite.com/admin' kholega */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;