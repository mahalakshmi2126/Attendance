// src/pages/Admin/AdminNavbar.jsx
import React, { useEffect, useRef, useState } from 'react';
import { FaUserCircle, FaGoogle, FaBars, FaTimes } from 'react-icons/fa';
import { BiSolidCircle } from 'react-icons/bi';
import { User, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminNavbar = ({ onProfileClick, onLogoutClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: 'Dashboard', key: 'dashboard', path: '/admin' },
    { name: 'Employees', key: 'employees', path: '/employeelist' },
    { name: 'Leave', key: 'leave', path: '/leave' },
    { name: 'Permission', key: 'permission', path: '/permission' },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabClick = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <>
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
        />
      )}

      <div className="relative z-50 bg-white/20 rounded-xl px-4 py-3 flex justify-between items-center mb-6 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-3">
          <FaGoogle size={28} className="text-red-500 bg-gradient-to-r from-green-400 via-yellow-500 to-blue-500 rounded-full" />
          <div>
            <h1 className="text-lg font-bold text-white">Attendance Management</h1>
            <p className="text-xs text-gray-200">Admin Control Panel</p>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:flex gap-4 bg-white rounded-full px-4 py-2 shadow-inner">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.path)}
              className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-semibold ${
                isActive(tab.path)
                  ? 'bg-lime-400 text-black shadow-md'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              {isActive(tab.path) && <BiSolidCircle size={8} />}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(true)} className="text-white text-xl">
            <FaBars />
          </button>
        </div>

        {/* Desktop Profile */}
        <div className="relative hidden md:flex items-center" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 text-white font-semibold hover:opacity-90"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaUserCircle size={24} className="text-green-400" />
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold">CorpWings</div>
              <div className="text-xs mr-7 text-gray-300">ADMIN</div>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-36 w-40 bg-white rounded shadow-lg py-2 text-black z-50">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => {
                  onProfileClick();
                  setDropdownOpen(false);
                }}
              >
                <User size={16} /> Profile
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => {
                  onLogoutClick();
                  setDropdownOpen(false);
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-auto w-80 bg-gray-900 text-white z-[1000] shadow-2xl transition-transform duration-300 ease-in-out transform ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        } rounded-l-xl p-4 flex flex-col justify-between`}
      >
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <FaGoogle size={28} className="text-red-500 bg-gradient-to-r from-green-400 via-yellow-500 to-blue-500 rounded-full" />
              <h2 className="text-lg font-semibold text-white mt-2">Attendance Management</h2>
              <p className="text-sm text-gray-400 mb-4">Admin Control Panel</p>
            </div>
            <button onClick={() => setMenuOpen(false)}>
              <FaTimes size={24} className="text-white" />
            </button>
          </div>

          <div className="space-y-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.path)}
                className={`w-full px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold ${
                  isActive(tab.path) ? 'bg-lime-400 text-black' : 'bg-gray-700 text-gray-300'
                }`}
              >
                {isActive(tab.path) && <BiSolidCircle size={8} />}
                {tab.name}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <button
              className="w-full bg-white/20 text-white text-sm py-2 rounded-lg border border-white/10"
              onClick={() => {
                onProfileClick();
                setMenuOpen(false);
              }}
            >
              Profile
            </button>
          </div>

          <div className="flex justify-between rounded px-4 py-3 mt-6">
            <div className="flex items-center gap-2">
              <FaUserCircle size={20} className="text-green-500" />
              <div className="text-left text-xs">
                <p className="font-semibold">CorpWings</p>
                <p className="text-gray-400 text-[10px]">ADMIN</p>
              </div>
            </div>
            <button
              className="bg-white text-black text-sm px-3 py-2 rounded-md flex items-center gap-1"
              onClick={() => {
                onLogoutClick();
                setMenuOpen(false);
              }}
            >
              <FaTimes size={12} /> Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminNavbar;
