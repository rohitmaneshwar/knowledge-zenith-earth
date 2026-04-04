import React, { useState, useEffect } from 'react';
import { FaTrash, FaStar, FaQuoteLeft } from 'react-icons/fa'; 

// ==========================================
// CONFIGURATION (Live karne ke liye zaroori)
// ==========================================
// Jab aap backend ko Render/PythonAnywhere par live karenge, 
// toh yahan unka diya hua URL dalna hoga (Jaise: 'https://omkar-backend.onrender.com')
const API_BASE_URL = 'http://localhost:5000'; 

// ==========================================
// ADMIN DASHBOARD COMPONENT
// ==========================================
const AdminDashboard = () => {
  // 1. States (Memory)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]); 
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOGIC & API CALLS
  // ==========================================

  // Admin Login Handle Karna
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        setIsAuthenticated(true); 
        fetchUsers(); 
        fetchAdminReviews(); 
      } else {
        setLoginError('Incorrect password. Access Denied.');
      }
    } catch (error) {
      setLoginError('Server error. Is Flask running?');
    }
  };

  // Database se saare Students lana
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`);
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // Database se saare Reviews lana
  const fetchAdminReviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Student ko hamesha ke liye Delete karna
  const deleteUser = async (id) => {
    if (window.confirm("Kya aap sach mein is student ko delete karna chahte hain?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setUsers(users.filter(user => user.id !== id));
          alert("Student successfully deleted!");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Review ko hamesha ke liye Delete karna
  const deleteReview = async (id) => {
    if (window.confirm("Kya aap is review ko hamesha ke liye delete karna chahte hain?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/reviews/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setReviews(reviews.filter(review => review.id !== id));
          alert("Review deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };


  // ==========================================
  // UI: LOGIN SCREEN (Agar login nahi kiya hai)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Admin Access Only</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter Secret Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              required 
            />
            <button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition">
              Unlock Dashboard
            </button>
          </form>
          {loginError && <p className="text-red-500 mt-4 font-medium">{loginError}</p>}
        </div>
      </div>
    );
  }

  // ==========================================
  // UI: MAIN DASHBOARD (Login ke baad)
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* DASHBOARD HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-lg shadow-sm gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your website registrations & reviews</p>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)} 
            className="text-red-500 hover:bg-red-50 font-bold px-6 py-2 rounded-lg transition border border-red-500"
          >
            Log Out
          </button>
        </div>

        {loading ? (
          <p className="text-center text-xl text-gray-600 font-bold mt-10">Loading Data...</p>
        ) : (
          <>
            {/* SECTION 1: REGISTERED STUDENTS TABLE */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                🎓 Registered Students <span className="bg-blue-100 text-blue-800 text-sm py-1 px-3 rounded-full">{users.length}</span>
              </h2>
              <div className="bg-white rounded-xl shadow-md overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-blue-900 text-white text-sm uppercase tracking-wider">
                      <th className="py-4 px-6">ID</th>
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-6">Contact Info</th>
                      <th className="py-4 px-6">Program & UTR</th>
                      <th className="py-4 px-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.length === 0 ? (
                      <tr><td colSpan="5" className="py-8 text-center text-gray-500">No registrations yet.</td></tr>
                    ) : (
                      users.map((user, index) => (
                        <tr key={index} className="hover:bg-blue-50 transition">
                          <td className="py-4 px-6 font-bold text-gray-600">#{user.id}</td>
                          <td className="py-4 px-6 font-semibold text-gray-900">{user.name}</td>
                          <td className="py-4 px-6">
                            <div className="text-gray-900">{user.email}</div>
                            <div className="text-gray-500 text-sm">📞 {user.phone}</div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-200 block w-max mb-2">
                              {user.program}
                            </span>
                            {user.transaction_id && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded border">UTR: {user.transaction_id}</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button 
                              onClick={() => deleteUser(user.id)} 
                              className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-3 rounded-full transition shadow-sm" 
                              title="Delete Student"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 2: REVIEWS MANAGEMENT */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                ⭐ Client Reviews <span className="bg-yellow-100 text-yellow-800 text-sm py-1 px-3 rounded-full">{reviews.length}</span>
              </h2>
              
              {reviews.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-md text-center text-gray-500">No reviews posted yet.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col relative group">
                      <FaQuoteLeft className="text-gray-100 text-4xl absolute top-4 right-4" />
                      
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div>
                          <h4 className="font-bold text-gray-900">{review.name}</h4>
                          <p className="text-xs text-blue-600 font-medium mb-1">{review.program}</p>
                          <div className="flex text-yellow-400 text-sm">
                            {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                          </div>
                        </div>
                        <button 
                          onClick={() => deleteReview(review.id)}
                          className="text-red-400 hover:text-white hover:bg-red-500 p-2 rounded-md transition shadow-sm border border-red-100"
                          title="Delete Review"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      
                      <p className="text-gray-600 text-sm italic flex-grow">"{review.message}"</p>
                      <p className="text-xs text-gray-400 mt-4 border-t pt-2">{review.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;