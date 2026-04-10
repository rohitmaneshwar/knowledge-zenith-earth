import React, { useState, useEffect } from 'react';
import { FaTrash, FaSignOutAlt, FaUserCircle, FaBookOpen, FaStar } from 'react-icons/fa';

const API_BASE_URL = 'https://knowledge-zenith-earth.onrender.com';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // 🌟 Teeno Data ke liye alag States
  const [users, setUsers] = useState([]); // Course Enrollments
  const [students, setStudents] = useState([]); // Registered Accounts (Login/Signup)
  const [reviews, setReviews] = useState([]); // Reviews
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. ADMIN LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        setIsAuthenticated(true);
        fetchAllData(); // Login hote hi saara data le aao
      } else {
        setError('Incorrect Password');
      }
    } catch (err) {
      setError('Server Error');
    }
    setLoading(false);
  };

  // 2. FETCH ALL DATA (Students, Users, Reviews)
  const fetchAllData = async () => {
    try {
      // Ek saath teeno APIs call kar rahe hain
      const [resUsers, resStudents, resReviews] = await Promise.all([
        fetch(`${API_BASE_URL}/api/users`),
        fetch(`${API_BASE_URL}/api/students`),
        fetch(`${API_BASE_URL}/api/reviews`)
      ]);
      
      setUsers(await resUsers.json());
      setStudents(await resStudents.json());
      setReviews(await resReviews.json());
    } catch (err) {
      console.error("Failed to fetch data");
    }
  };

  // 3. DELETE FUNCTIONS
  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Delete ${name}'s course record?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) setUsers(users.filter(u => u.id !== id));
    } catch (err) { alert('Error deleting course record.'); }
  };

  const handleDeleteStudent = async (id, name) => {
    if (!window.confirm(`Delete ${name}'s registered account?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/students/${id}`, { method: 'DELETE' });
      if (res.ok) setStudents(students.filter(s => s.id !== id));
    } catch (err) { alert('Error deleting account.'); }
  };

  // 4. GROUP COURSE DATA
  const groupedUsers = users.reduce((groups, user) => {
    const courseName = user.program || 'Other Enquiries';
    if (!groups[courseName]) groups[courseName] = [];
    groups[courseName].push(user);
    return groups;
  }, {});

  // ==========================================
  // UI RENDER
  // ==========================================
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">Admin Login</h2>
          {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 py-2 rounded">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" placeholder="Enter Admin Password" required 
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition">
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HEADER */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-blue-900">Knowledge Zenith Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage accounts, courses, and reviews.</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition">
            <FaSignOutAlt /> <span className="hidden md:inline">Logout</span>
          </button>
        </div>

        {/* ========================================== */}
        {/* SECTION 1: REGISTERED ACCOUNTS (NEW SIGN UPS) */}
        {/* ========================================== */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-green-700 px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaUserCircle /> Registered Accounts
            </h2>
            <span className="bg-white text-green-800 text-xs px-3 py-1 rounded-full font-bold">
              {students.length} Total
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                  <th className="p-4 font-bold">Name</th>
                  <th className="p-4 font-bold">Email</th>
                  <th className="p-4 font-bold">Phone</th>
                  <th className="p-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr><td colSpan="4" className="p-4 text-center text-gray-500 py-8">No registered accounts found.</td></tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-4 font-bold text-gray-900">{student.name}</td>
                      <td className="p-4 text-sm text-gray-800">{student.email}</td>
                      <td className="p-4 text-sm text-gray-600">{student.phone}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDeleteStudent(student.id, student.name)} className="text-red-400 hover:text-red-600 p-2"><FaTrash /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================== */}
        {/* SECTION 2: COURSE ENROLLMENTS */}
        {/* ========================================== */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaBookOpen className="text-blue-600"/> Course Enrollments
          </h2>
          {Object.keys(groupedUsers).length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500">
              No course enrollments yet.
            </div>
          ) : (
            Object.keys(groupedUsers).map((courseName, index) => (
              <div key={index} className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-blue-900 px-6 py-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">{courseName}</h3>
                  <span className="bg-white text-blue-900 text-xs px-3 py-1 rounded-full font-bold">
                    {groupedUsers[courseName].length} Students
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                        <th className="p-4 font-bold">Date</th>
                        <th className="p-4 font-bold">Name</th>
                        <th className="p-4 font-bold">Contact</th>
                        <th className="p-4 font-bold">Trans ID</th>
                        <th className="p-4 font-bold text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedUsers[courseName].map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                          <td className="p-4 text-sm text-gray-500 whitespace-nowrap">{user.date}</td>
                          <td className="p-4 font-bold text-gray-900">{user.name}</td>
                          <td className="p-4">
                            <div className="text-sm text-gray-800">{user.email}</div>
                            <div className="text-xs text-gray-500">{user.phone}</div>
                          </td>
                          <td className="p-4 text-sm font-mono text-blue-600">{user.transaction_id || 'N/A'}</td>
                          <td className="p-4 text-center">
                            <button onClick={() => handleDeleteUser(user.id, user.name)} className="text-red-400 hover:text-red-600 p-2"><FaTrash /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ========================================== */}
        {/* SECTION 3: REVIEWS */}
        {/* ========================================== */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-yellow-500 px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaStar /> Client Reviews
            </h2>
            <span className="bg-white text-yellow-600 text-xs px-3 py-1 rounded-full font-bold">
              {reviews.length} Reviews
            </span>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 col-span-2 text-center py-4">No reviews submitted yet.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border border-gray-100 bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{review.name}</h4>
                      <p className="text-xs text-blue-600 font-bold">{review.program}</p>
                    </div>
                    <span className="text-yellow-500 flex text-sm">
                      {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 italic">"{review.message}"</p>
                  <p className="text-xs text-gray-400 mt-3">{review.date}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;