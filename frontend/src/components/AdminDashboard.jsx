import React, { useState, useEffect } from 'react';
import { FaTrash, FaSignOutAlt } from 'react-icons/fa';

const API_BASE_URL = 'https://knowledge-zenith-earth.onrender.com';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
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
        fetchUsers(); // Login hote hi data le aao
      } else {
        setError('Incorrect Password');
      }
    } catch (err) {
      setError('Server Error');
    }
    setLoading(false);
  };

  // 2. DATA FETCH KARNA
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users");
    }
  };

  // 3. DELETE USER API CALL
  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${name}'s record?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        // Delete hone ke baad table se turant hata do
        setUsers(users.filter(user => user.id !== id));
        alert('User deleted successfully!');
      } else {
        alert('Failed to delete user.');
      }
    } catch (err) {
      alert('Server error while deleting.');
    }
  };

  // ==========================================
  // 🌟 DATA GROUPING (COURSE KE HISAAB SE ALAG KARNA) 🌟
  // ==========================================
  const groupedUsers = users.reduce((groups, user) => {
    const courseName = user.program || 'Other Enquiries';
    if (!groups[courseName]) {
      groups[courseName] = [];
    }
    groups[courseName].push(user);
    return groups;
  }, {});


  // ==========================================
  // UI RENDER
  // ==========================================
  
  // Agar Login nahi hai, toh Password maango
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

  // Agar Login ho gaya hai, toh Dashboard dikhao
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-blue-900">Knowledge Zenith Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage all your student enrollments here.</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition">
            <FaSignOutAlt /> <span className="hidden md:inline">Logout</span>
          </button>
        </div>

        {/* 🌟 DYNAMIC SECTIONS: COURSE-WISE DATA 🌟 */}
        {Object.keys(groupedUsers).length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500">
            No registrations found yet.
          </div>
        ) : (
          Object.keys(groupedUsers).map((courseName, index) => (
            <div key={index} className="mb-10 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* Course Title Header */}
              <div className="bg-blue-900 px-6 py-4 border-b">
                <h2 className="text-xl font-bold text-white flex justify-between items-center">
                  {courseName}
                  <span className="bg-white text-blue-900 text-xs px-3 py-1 rounded-full">
                    {groupedUsers[courseName].length} Students
                  </span>
                </h2>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                      <th className="p-4 font-bold">Date</th>
                      <th className="p-4 font-bold">Name</th>
                      <th className="p-4 font-bold">Email / Phone</th>
                      <th className="p-4 font-bold">Transaction ID</th>
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
                        <td className="p-4 text-sm font-mono text-blue-600">
                          {user.transaction_id || <span className="text-gray-400 italic">N/A (Free)</span>}
                        </td>
                        <td className="p-4 text-center">
                          {/* 🌟 DELETE BUTTON 🌟 */}
                          <button 
                            onClick={() => handleDelete(user.id, user.name)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Delete Student"
                          >
                            <FaTrash />
                          </button>
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
    </div>
  );
};

export default AdminDashboard;