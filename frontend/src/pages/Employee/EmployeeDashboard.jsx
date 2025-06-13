import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle, FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import EmployeeNavbar from './EmployeeNavbar';
import EmpLeaveTable from './EmpLeaveTable';
import EmpPermissionTable from './EmpPermissionTable';
import EmpAttendanceTab from './EmployeeAttendanceTab';
import EmpDashboardTab from './empdash';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const [monthlySummary, setMonthlySummary] = useState(null);
  const [monthlySummaryLoading, setMonthlySummaryLoading] = useState(false);
  const [monthlySummaryError, setMonthlySummaryError] = useState(null);

  
  const [employeeId, setEmployeeId] = useState('');


  const [checkInTime, setCheckInTime] = useState('-');
  const [leaveStatusCounts, setLeaveStatusCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [todayPermissions, setTodayPermissions] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Fetch Monthly Summary by employeeId, year, month
  const fetchMonthlySummary = async (employeeId, year, month) => {
    setMonthlySummaryLoading(true);
    setMonthlySummaryError(null);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(
        `http://localhost:5000/api/attendance/monthly-summary/${employeeId}/${year}/${month}`,
        { headers }
      );
      setMonthlySummary(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        // No data found for this month, set all to zero
        setMonthlySummary({
          Present: 0,
          Absent: 0,
          'Half Day': 0,
          Permission: 0,
          Leave: 0,
        });
      } else {
        setMonthlySummaryError(err.message || 'Failed to load monthly summary');
      }
    } finally {
      setMonthlySummaryLoading(false);
    }
  };

  // Fetch all dashboard data on mount
  const fetchDashboardData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch profile data
      const profileRes = await axios.get('http://localhost:5000/api/profile', { headers });
      setProfileData(profileRes.data.profile);



      // 2. Extract employeeId from profile (adjust this if your backend differs)
      const employeeId = profileRes.data.profile?._id || profileRes.data.profile?.employeeId;
      if (!employeeId) {
        throw new Error('Employee ID not found in profile');
      }

  
      // 3. Prepare year and month for monthly summary API
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');

      setEmployeeId(employeeId); // save it for future fetch
      // 4. Fetch monthly attendance summary
      await fetchMonthlySummary(employeeId, year, month);

      // 5. Fetch today's attendance (for check-in time)
      try {
        const attendanceRes = await axios.get('http://localhost:5000/api/attendance/my-today', { headers });
        setCheckInTime(
  attendanceRes.data.todayStatus?.checkIn
    ? attendanceRes.data.todayStatus.checkIn
    : '-'
);
        console.log('attendanceRes.data:', attendanceRes.data);
        console.log('DASHBOARD CHECKIN TIME:', attendanceRes.data.attendance?.checkInTime);
        console.log('DASHBOARD CHECKIN TIME (formatted):', checkInTime);
      } catch (err) {
        if (err.response?.status === 404) {
          setCheckInTime('-');
        } else {
          throw err;
        }
      }

      // 6. Fetch leave requests and calculate counts by status
      const leaveRes = await axios.get('http://localhost:5000/api/leave/my-requests', { headers });
      const leaves = leaveRes.data.leaveRequests || leaveRes.data || [];
      const pendingLeaves = leaves.filter((l) => l.status === 'Pending').length;
      const approvedLeaves = leaves.filter((l) => l.status === 'Approved').length;
      const rejectedLeaves = leaves.filter((l) => l.status === 'Rejected').length;
      setLeaveStatusCounts({ pending: pendingLeaves, approved: approvedLeaves, rejected: rejectedLeaves });

      // 7. Fetch permission requests and calculate counts by status
      const permissionRes = await axios.get('http://localhost:5000/api/permission/my-requests', { headers });
      const permissions = permissionRes.data || [];
      const pendingPerm = permissions.filter((p) => p.status === 'Pending').length;
      const approvedPerm = permissions.filter((p) => p.status === 'Approved').length;
      const rejectedPerm = permissions.filter((p) => p.status === 'Rejected').length;
      setTodayPermissions({ pending: pendingPerm, approved: approvedPerm, rejected: rejectedPerm });

    } catch (err) {
      console.error('❌ Dashboard loading failed:', err.response?.data || err.message);
      toast.error('Error loading dashboard');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleProfileClick = () => {
    setShowProfileModal(true);
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
        <EmployeeNavbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onProfileClick={handleProfileClick}
          onLogoutClick={handleLogout}
        />
      </div>

      {/* Profile Modal */}
      {showProfileModal && profileData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="relative bg-white/30 text-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl flex flex-col sm:flex-row gap-6">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 text-white hover:text-red-500 text-xl"
              aria-label="Close"
            >
              <FaTimes />
            </button>

            <div className="flex justify-center sm:justify-start sm:w-1/2">
              <div className="rounded-full w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center shadow-md">
                <FaUserCircle size={130} className="text-lime-400" />
              </div>
            </div>

            <div className="text-sm sm:text-base sm:w-1/2 space-y-2">
              <p>
                <strong>Full Name: </strong> {profileData.fullName}
              </p>
              <p>
                <strong>Username: </strong> {profileData.username}
              </p>
              <p>
                <strong>Email: </strong> {profileData.mailID}
              </p>
              <p>
                <strong>Mobile: </strong> {profileData.mobile}
              </p>
              <p>
                <strong>Role: </strong> {profileData.role}
              </p>
              <p>
                <strong>mobileMacAddress: </strong> {profileData.mobileMacAddress}
              </p>
              <p>
                <strong>laptopMacAddress: </strong> {profileData.laptopMacAddress}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="px-6 py-6">
        {activeTab === 'dashboard' && (
          <EmpDashboardTab
  profileData={profileData}
  checkInTime={checkInTime}
  statusCounts={leaveStatusCounts}
  todayPermissions={todayPermissions}
  monthlySummary={monthlySummary}
  monthlySummaryLoading={monthlySummaryLoading}
  monthlySummaryError={monthlySummaryError}
  fetchMonthlySummary={fetchMonthlySummary}
  employeeId={employeeId}
/>

        )}

        {activeTab === 'attendance' && <EmpAttendanceTab />}
        {activeTab === 'leave' && <EmpLeaveTable profileData={profileData} />}
        {activeTab === 'permission' && <EmpPermissionTable />}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
