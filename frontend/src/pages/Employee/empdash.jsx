import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';


const EmpDashboardTab = ({
  profileData,
  checkInTime,
  todayPermissions,
  statusCounts,
  monthlySummary,
  monthlySummaryLoading,
  monthlySummaryError,
  employeeId,
  fetchMonthlySummary,
}) => {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [dateStatusList, setDateStatusList] = useState([]);

  const fetchDateStatusList = async (employeeId, year, month) => {
    try {
      const token = localStorage.getItem('token'); // Use same token name everywhere
      const response = await fetch(
        `http://localhost:5000/api/attendance/monthly-summary/${employeeId}/${year}/${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      // Use dailyRecords only
      if (Array.isArray(data.dailyRecords)) {
        setDateStatusList(data.dailyRecords); // [{ date: '2025-06-03', status: 'Leave' }, ...]
      } else {
        setDateStatusList([]);
      }
    } catch (error) {
      console.error('Error fetching date status list', error);
    }
  };


  const handleDateChange = (date) => {
    setSelectedDate(date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    fetchMonthlySummary(employeeId, year, month);
    fetchDateStatusList(employeeId, year, month);
  };

  return (
    <div className="bg-white/20 p-6 rounded-2xl shadow-xl text-white space-y-6 relative">
      {/* Welcome Message */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">
            👋 Welcome, {profileData?.fullName || 'Employee'}!
          </h2>
          <p className="text-sm text-gray-200">
            {new Date().toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Shift */}
        <div className="bg-black/30 p-4 rounded-xl shadow-inner">
          <p className="text-lg font-semibold">Shift</p>
          <p className="text-sm">10:00 AM - 5:00 PM</p>
        </div>

        {/* Attendance */}
        <div className="bg-black/30 p-4 rounded-xl shadow-inner">
  <p className="text-lg font-semibold text-white mb-1">Check-In Status</p>
  {checkInTime && checkInTime !== '-' ? (
  <p className="text-sm text-green-400">✅ Check-In Time: {checkInTime}</p>
) : (
  <p className="text-sm text-red-400">❌ Not Checked In</p>
)}
</div>


        {/* Leave */}
        <div className="bg-black/30 p-4 rounded-xl shadow-inner">
          <p className="text-lg font-semibold">Leave Requests</p>
          <p className="text-sm">Total: {(statusCounts?.pending || 0) + (statusCounts?.approved || 0) + (statusCounts?.rejected || 0)}</p>
          <p className="text-sm">🕒 Pending: {statusCounts?.pending || 0}</p>
          <p className="text-sm text-green-300">✅ Approved: {statusCounts?.approved || 0}</p>
          <p className="text-sm text-red-300">❌ Rejected: {statusCounts?.rejected || 0}</p>
        </div>

        {/* Permission */}
        <div className="bg-black/30 p-4 rounded-xl shadow-inner">
          <p className="text-lg font-semibold">Permission Requests</p>
          <p className="text-sm font-bold">
            Total: {(todayPermissions?.pending || 0) + (todayPermissions?.approved || 0) + (todayPermissions?.rejected || 0)}
          </p>
          <p className="text-sm">🕒 Pending: {todayPermissions?.pending || 0}</p>
          <p className="text-sm text-green-300">✅ Approved: {todayPermissions?.approved || 0}</p>
          <p className="text-sm text-red-300">❌ Rejected: {todayPermissions?.rejected || 0}</p>
        </div>

        {/* Monthly Attendance */}
        <div className="bg-black/30 p-4 rounded-xl shadow-inner col-span-1 sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center mb-2">
            <p className="text-lg font-semibold">Monthly Attendance</p>
            <div className="relative inline-block">
              <button
                onClick={() => {
                  const today = new Date();
                  setShowCalendarModal(true);
                  const year = today.getFullYear();
                  const month = String(today.getMonth() + 1).padStart(2, '0');
                  fetchDateStatusList(employeeId, year, month);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FaCalendarAlt />
                Open Calendar
              </button>

            </div>
          </div>

          {monthlySummaryLoading ? (
            <p className="text-sm italic">Loading summary...</p>
          ) : monthlySummaryError ? (
            <p className="text-sm italic text-red-400">Error: {monthlySummaryError}</p>
          ) : monthlySummary ? (
            <>
              <p className="text-sm text-green-400">✅ Present: {monthlySummary.Present || 0}</p>
              <p className="text-sm text-red-400">❌ Absent: {monthlySummary.Absent || 0}</p>
              <p className="text-sm text-yellow-400">🕒 Half Day: {monthlySummary['Half Day'] || 0}</p>
              <p className="text-sm text-purple-400">🛂 Permission: {monthlySummary.Permission || 0}</p>
              <p className="text-sm text-blue-400">📝 Leave: {monthlySummary.Leave || 0}</p>
            </>
          ) : (
            <p className="text-sm italic">No summary data available.</p>
          )}
        </div>

        {/* Quote */}
        <div className="bg-black/30 p-4 rounded-xl shadow-inner col-span-1 sm:col-span-2 lg:col-span-1">
          <p className="text-lg font-semibold">Quote of the Day</p>
          <p className="text-sm italic">“Success is the sum of small efforts, repeated day in and day out.”</p>
        </div>
      </div>

      {/* Calendar Modal */}
      {/* Calendar Modal */}
      {showCalendarModal && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="bg-white/30 rounded-2xl p-6 shadow-2xl w-80 relative"
            >
              <button
                onClick={() => setShowCalendarModal(false)}
                className="absolute top-2 right-3 text-2xl font-bold text-white hover:text-black transition"
              >
                &times;
              </button>

              <h2 className="text-xl font-bold text-center mb-4 text-white">
                📅 Select a Date
              </h2>

              {/* Month-Year Dropdown */}

              <div className="flex flex-col items-center gap-4">
                {/* Custom Month-Year Selectors with dropdown UI */}
                <div className="flex justify-center items-center gap-4">
                  {/* Month Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedDate.getMonth()}
                      onChange={(e) => {
                        const newMonth = parseInt(e.target.value);
                        const updated = new Date(selectedDate);
                        updated.setMonth(newMonth);
                        setSelectedDate(updated);
                        fetchMonthlySummary(employeeId, updated.getFullYear(), String(updated.getMonth() + 1).padStart(2, '0'));
                        fetchDateStatusList(employeeId, updated.getFullYear(), String(updated.getMonth() + 1).padStart(2, '0'));
                      }}
                      className="appearance-none bg-white text-black font-medium py-1 px-4 pr-8 rounded shadow-sm focus:outline-none"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>
                          {new Date(0, i).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-700">
                    </div>
                  </div>

                  {/* Year Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedDate.getFullYear()}
                      onChange={(e) => {
                        const newYear = parseInt(e.target.value);
                        const updated = new Date(selectedDate);
                        updated.setFullYear(newYear);
                        setSelectedDate(updated);
                        fetchMonthlySummary(employeeId, newYear, String(updated.getMonth() + 1).padStart(2, '0'));
                        fetchDateStatusList(employeeId, newYear, String(updated.getMonth() + 1).padStart(2, '0'));
                      }}
                      className="appearance-none bg-white text-black font-medium py-1 px-4 pr-8 rounded shadow-sm focus:outline-none"
                    >
                      {Array.from({ length: 5 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-700">
                    </div>
                  </div>
                </div>

                {/* Calendar UI */}
                <DatePicker
                  inline
                  selected={selectedDate}
                  openToDate={selectedDate} // 👈 this controls calendar view
                  onChange={(date) => {
                    const todayStr = new Date().toISOString().split('T')[0];
                    const clickedStr = date.toISOString().split('T')[0];
                    if (clickedStr !== todayStr) return;

                    handleDateChange(date);
                    setShowCalendarModal(false);
                  }}
                  maxDate={new Date()}
                  renderCustomHeader={() => null}
                  dayClassName={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const dateCopy = new Date(date);
                    dateCopy.setHours(0, 0, 0, 0);

                    const formatted = date.toISOString().split('T')[0];
                    const status = dateStatusList.find((d) => d.date === formatted)?.status;

                    const isToday = dateCopy.getTime() === today.getTime();
                    const isFuture = dateCopy.getTime() > today.getTime();
                    const isPast = dateCopy.getTime() < today.getTime();

                    const baseClass = 'rounded-full font-semibold text-center';
                    const statusClass =
                      status === 'Present'
                        ? 'bg-green-400 text-white pointer-events-none'
                        : status === 'Absent'
                          ? 'bg-red-400 text-white pointer-events-none'
                          : status === 'Half Day'
                            ? 'bg-yellow-300 text-black pointer-events-none'
                            : status === 'Leave'
                              ? 'bg-blue-400 text-white pointer-events-none'
                              : status === 'Permission'
                                ? 'bg-purple-400 text-white pointer-events-none'
                                : '';

                    const todayHighlight = isToday ? 'ring-2 ring-white' : '';
                    const futureDisable = isFuture ? 'pointer-events-none opacity-40' : '';
                    const pastBlack = isPast && !status ? 'text-black pointer-events-none' : '';

                    return classNames(baseClass, statusClass, todayHighlight, futureDisable, pastBlack);
                  }}
                />

              </div>


            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

    </div>
  );
};
export default EmpDashboardTab;