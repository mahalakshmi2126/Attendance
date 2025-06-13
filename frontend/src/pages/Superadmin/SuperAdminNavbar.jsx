import React, { useEffect, useRef, useState } from 'react';
import { FaUserCircle, FaGoogle } from 'react-icons/fa';
import { BiSolidCircle } from 'react-icons/bi';

const SuperAdminNavbar = ({ activeTab, setActiveTab, onProfileClick, onLogoutClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const tabs = [
    { name: 'Clients', key: 'clients' },
    { name: 'Trashclients', key: 'trashclients' },
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
      <div className="relative z-50 bg-white/20 rounded-xl px-6 py-4 flex justify-between items-center mb-6 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-4">
          <FaGoogle size={28} className="text-red-500 bg-gradient-to-r from-green-400 via-yellow-500 to-blue-500 rounded-full" />
          <div>
            <h1 className="text-xl font-bold">Attendance Management</h1>
            <p className="text-sm text-gray-200">Employee Attendance System</p>
          </div>
        </div>

        <div className="bg-white rounded-full px-4 py-2 flex gap-4 shadow-inner">
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

        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 text-white font-semibold hover:opacity-90"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaUserCircle size={24} className="text-green-400" />
            <div className="text-right">
              <div className="text-sm font-semibold">CorpWings</div>
              <div className="text-xs mr-7 text-gray-300">SUPERADMIN</div>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg py-2 text-black z-50">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  onProfileClick();
                  setDropdownOpen(false);
                }}
              >
                Profile
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  onLogoutClick();
                  setDropdownOpen(false);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
  );
};

export default SuperAdminNavbar;