import React, { useEffect, useRef, useState } from 'react';
import { FaUserCircle, FaGoogle, FaBars, FaTimes } from 'react-icons/fa';
import { BiSolidCircle } from 'react-icons/bi';
import { User, LogOut } from 'lucide-react';

const EmployeeNavbar = ({ activeTab, setActiveTab, onProfileClick, onLogoutClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef();

  const tabs = [
    { name: 'Dashboard', key: 'dashboard' },
    { name: 'Attendance', key: 'attendance' },
    { name: 'Leave', key: 'leave' },
    { name: 'Permission', key: 'permission' },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Overlay when drawer is open */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
        />
      )}

      {/* Navbar */}
      <div className="relative z-50 bg-white/20 rounded-xl px-6 py-4 flex justify-between items-center shadow-md backdrop-blur-md">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <FaGoogle size={28} className="text-red-500 bg-gradient-to-r from-green-400 via-yellow-500 to-blue-500 rounded-full" />
          <div>
            <h1 className="text-xl font-bold text-white">Attendance Management</h1>
            <p className="text-sm text-gray-200">Employee Attendance System</p>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:flex bg-white rounded-full px-4 py-2 gap-4 shadow-inner">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-semibold ${
                activeTab === tab.key
                  ? 'bg-lime-400 text-black shadow-md'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              {activeTab === tab.key && <BiSolidCircle size={8} />}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(true)} className="text-white text-xl">
            <FaBars />
          </button>
        </div>

        {/* Profile Dropdown */}
        <div className="relative hidden md:flex" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 text-white font-semibold hover:opacity-90"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaUserCircle size={24} className="text-green-400" />
            <div className="text-right">
              <div className="text-sm font-semibold">CorpWings</div>
              <div className="text-xs mr-2 text-gray-300">EMPLOYEE</div>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-12 w-40 bg-white rounded shadow-lg py-2 text-black z-50">
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

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-auto w-72 bg-gray-900 text-white z-[1000] transition-transform duration-300 ease-in-out transform ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        } rounded-l-xl p-4`}
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <FaGoogle size={28} className="text-red-500 bg-gradient-to-r from-green-400 via-yellow-500 to-blue-500 rounded-full" />
            <h2 className="text-lg font-semibold mt-2">Attendance Management</h2>
            <p className="text-sm text-gray-400">Employee Panel</p>
          </div>
          <button onClick={() => setMenuOpen(false)}>
            <FaTimes size={24} className="text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="space-y-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setMenuOpen(false);
              }}
              className={`w-full px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold ${
                activeTab === tab.key
                  ? 'bg-lime-400 text-black'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {activeTab === tab.key && <BiSolidCircle size={8} />}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Profile Button */}
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

        {/* Footer Section */}
        <div className="flex justify-between rounded px-4 py-3 mt-6">
          <div className="flex items-center gap-2">
            <FaUserCircle size={20} className="text-green-500" />
            <div className="text-left text-xs">
              <p className="font-semibold">CorpWings</p>
              <p className="text-gray-400 text-[10px]">EMPLOYEE</p>
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
    </>
  );
};

export default EmployeeNavbar;