import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaUserShield, FaUserTie, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';
import 'react-toastify/dist/ReactToastify.css';
import bg from '../assets/bg.jpg';

const LoginPage = ({ setRole }) => {
  const [officeId, setOfficeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setUserRole] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Show logout toast if redirected after logout
  useEffect(() => {
    if (location.state?.fromLogout) {
      toast.success('Logged out successfully!');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!officeId || !password || !role) {
      toast.warning('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        officeId,
        password,
        role,
      });

      if (!res.data.role || !res.data.token) {
        toast.error('Login response is missing role or token');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('fullName', res.data.fullName);
      localStorage.setItem('role', res.data.role);

      setRole(res.data.role);
      toast.success('Login successfully!');
      setTimeout(() => {
  navigate(
    res.data.role === 'superadmin'
      ? '/client'
      : res.data.role === 'admin'
        ? '/admin'
        : '/dashboard',
    { replace: true }
  );
}, 1000);
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'superadmin':
        return <FaUserShield className="text-xl text-blue-500" />;
      case 'admin':
        return <FaUserTie className="text-xl text-green-500" />;
      case 'employee':
        return <FaUser className="text-xl text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 z-0" />
      <div className="relative z-10 bg-white/20 backdrop-blur-md shadow-2xl rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-6 drop-shadow">
          Login Page
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-white mb-1">Office ID</label>
            <input
              type="text"
              value={officeId}
              onChange={(e) => setOfficeId(e.target.value)}
              placeholder="Enter your Office ID"
              className="w-full px-4 py-2 bg-white/30 text-white placeholder-white/70 border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-white mb-1">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 pr-10 bg-white/30 text-white placeholder-white/70 border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 cursor-pointer text-white"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-1">Role</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full px-4 py-2 border border-white/50 rounded-lg bg-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                required
              >
                <option value="" disabled>
                  Select a role
                </option>
                <option value="superadmin" className="text-black bg-white">
                  Superadmin
                </option>
                <option value="admin" className="text-black bg-white">
                  Admin
                </option>
                <option value="employee" className="text-black bg-white">
                  Employee
                </option>
              </select>
              {role && (
                <div className="absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none">
                  {getRoleIcon()}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <ImSpinner2 className="animate-spin text-white text-lg" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>

      {/* ✅ Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default LoginPage;
