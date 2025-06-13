import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FaUserCircle, FaTimes } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

import AdminNavbar from './AdminNavbar';
import EmployeeFormModal from './EmployeeFormModal';
import EmployeeViewModal from './EmployeeViewModal';
import LeaveTable from './LeaveTable';
import PermissionTable from './PermissionTable';

const AdminDashboard = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 0,
    presentCount: 0,
    absentCount: 0,
    pendingLeaves: 0,
    pendingPermissions: 0,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const currentPath = location.pathname;
  const activeTab =
    currentPath === '/admin' ? 'dashboard' :
      currentPath === '/employeelist' ? 'employees' :
        currentPath === '/leave' ? 'leave' :
          currentPath === '/permission' ? 'permission' :
            '';

  useEffect(() => {
    if (activeTab === 'dashboard') {
      const fetchDashboardStats = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/dashboard/stats', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDashboardStats(res.data);
        } catch (err) {
          console.error('Failed to fetch dashboard stats:', err);
          toast.error('Failed to load dashboard stats');
        }
      };

      fetchDashboardStats();
    }
  }, [activeTab, token]);

  const handleProfileClick = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData(res.data.profile);
      toast.success('Profile loaded successfully');
      setShowProfileModal(true);
    } catch (err) {
      console.error('Error fetching profile:', err);
      toast.error('Failed to load profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login', { state: { fromLogout: true } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 text-white">
      <ToastContainer />

      {/* Navbar */}
      <div className="px-6 pt-6">
        <AdminNavbar
          activeTab={activeTab}
          onProfileClick={handleProfileClick}
          onLogoutClick={handleLogout}
        />
      </div>

      {/* Profile Modal */}
      {showProfileModal && profileData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-2">
          <div className="relative bg-white/30 text-white rounded-2xl p-4 sm:p-6 w-full max-w-4xl shadow-2xl flex flex-col sm:flex-row gap-4 sm:gap-6 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-3 right-3 text-white hover:text-red-500 text-lg"
              aria-label="Close"
            >
              <FaTimes />
            </button>

            <div className="flex justify-center sm:w-1/3">
              <div className="rounded-full w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center text-6xl mt-2 sm:mt-3 text-black shadow-md">
                <FaUserCircle size={120} className="text-lime-400" />
              </div>
            </div>

            <div className="sm:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 sm:mt-8 text-sm sm:text-base">
              <div className="space-y-2">
                <p><strong>Full Name:</strong> {profileData?.fullName}</p>
                <p><strong>Username:</strong> {profileData?.username}</p>
                <p><strong>Email:</strong> {profileData?.mailID}</p>
                <p><strong>Mobile:</strong> {profileData?.mobile}</p>
              </div>
              <div className="space-y-2 sm:border-l sm:border-gray-800 sm:pl-6">
                <p><strong>Brand:</strong> {profileData?.brandName}</p>
                <p><strong>Location:</strong> {profileData?.location}</p>
                <p><strong>Validity:</strong> {profileData?.validity}</p>
                <p><strong>Role:</strong> {profileData?.role}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="px-6 py-6">
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="bg-white/20 p-6 rounded-2xl shadow-xl text-white space-y-6">
            <div>
              <h2 className="text-3xl font-bold">👋 Welcome, {profileData?.fullName || 'Admin'}!</h2>
              <p className="text-sm text-gray-200">
                {new Date().toLocaleString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-black/30 p-4 rounded-xl shadow-inner">
                <p className="text-lg font-semibold">Total Employees</p>
                <p className="text-sm">{dashboardStats.totalEmployees}</p>
              </div>
              <div className="bg-black/30 p-4 rounded-xl shadow-inner">
                <p className="text-lg font-semibold">Today's Attendance</p>
                <p className="text-sm text-green-400">{dashboardStats.presentCount} Present</p>
              </div>
              <div className="bg-black/30 p-4 rounded-xl shadow-inner">
                <p className="text-lg font-semibold">Today's Absentees</p>
                <p className="text-sm text-red-400">{dashboardStats.absentCount} Absent</p>
              </div>
              <div className="bg-black/30 p-4 rounded-xl shadow-inner">
                <p className="text-lg font-semibold">Pending Leaves</p>
                <p className="text-sm">{dashboardStats.pendingLeaves} Requests</p>
              </div>
              <div className="bg-black/30 p-4 rounded-xl shadow-inner">
                <p className="text-lg font-semibold">Pending Permissions</p>
                <p className="text-sm">{dashboardStats.pendingPermissions} Requests</p>
              </div>
              <div className="bg-black/30 p-4 rounded-xl shadow-inner col-span-1 sm:col-span-2 lg:col-span-1">
                <p className="text-lg font-semibold">Quote of the Day</p>
                <p className="text-sm italic">
                  “Leadership is about making others better as a result of your presence.”
                </p>
              </div>
            </div>
          </div>
        )}

        {/* EMPLOYEES */}
        {activeTab === 'employees' && (
          <div className="space-y-4">
            {showFormModal && <EmployeeFormModal closeModal={() => setShowFormModal(false)} />}
            <EmployeeViewModal onCreate={() => setShowFormModal(true)} />
          </div>
        )}

        {/* LEAVE */}
        {activeTab === 'leave' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Leave Requests List</h2>
            <LeaveTable />
          </div>
        )}

        {/* PERMISSION */}
        {activeTab === 'permission' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Permission Requests List</h2>
            <PermissionTable />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
