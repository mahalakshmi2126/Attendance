import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EmpAttendanceTab = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [todayStatus, setTodayStatus] = useState(null);
  const token = localStorage.getItem('token');

  const fetchAttendance = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/attendance/my-today', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const today = res.data.todayStatus;

      if (today) {
        const todayRow = {
          date: new Date().toISOString(),
          checkIn: today.checkIn || null,
          checkOut: today.checkOut || null,
          status: today.status || 'Pending',
        };
        setAttendanceData([todayRow]);
      } else {
        setAttendanceData([]);
      }

      setTodayStatus(today || null);
    } catch (error) {
      toast.error('❌ Failed to load attendance');
    }
  };

const handleCheckIn = async () => {
  try {
    const res = await axios.post(
      'http://localhost:3001/trigger-checkin',
      { token },
    );

    toast.success(`✅ ${res.data.message} at ${res.data.time}`);

    const newRow = {
      date: res.data.date,
      checkIn: res.data.time,
      checkOut: null,
      status: 'Pending',
    };
    setAttendanceData((prev) => [...prev, newRow]);
    fetchAttendance();

  } catch (err) {
    toast.error(err.response?.data?.message || '❌ Check-in failed');
  }
};


  const handleCheckOut = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/attendance/checkout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`✅ ${res.data.message}`);
      fetchAttendance();
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Check-out failed');
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="bg-white/20 p-6 rounded-xl shadow-md text-white space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">🕒 Today's Attendance</h2>
          <p className="text-sm text-gray-200">{new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleCheckIn}
            disabled={!!todayStatus?.checkIn}
            className={`px-4 py-2 rounded-lg ${todayStatus?.checkIn ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
          >
            Check In
          </button>
          <button
            onClick={handleCheckOut}
            disabled={!todayStatus?.checkIn || !!todayStatus?.checkOut}
            className={`px-4 py-2 rounded-lg ${todayStatus?.checkOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
          >
            Check Out
          </button>
        </div>
      </div>

      <div className="bg-black/30 p-4 rounded-md">
        <h3 className="font-semibold text-lg mb-2">Today's Status:</h3>
        {todayStatus ? (
          <p>
            🟢 Time In: <strong>{todayStatus.checkIn || '—'}</strong> | ⏹️ Time Out:{' '}
            <strong>{todayStatus.checkOut || '—'}</strong>
          </p>
        ) : (
          <p>❌ No record yet</p>
        )}
      </div>

      <div className="w-full overflow-x-auto bg-white/10 rounded-md shadow-md">
        <table className="min-w-full table-auto text-sm text-left text-white">
          <thead className="text-xs uppercase bg-blue-300 text-black">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Date</th>
              <th className="px-4 py-3 whitespace-nowrap">Check-In</th>
              <th className="px-4 py-3 whitespace-nowrap">Check-Out</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.length > 0 ? (
              attendanceData.map((item, idx) => (
                <tr key={idx} className="border-t border-white/20 hover:bg-white/5 transition">
                  <td className="px-4 py-2 whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {item.checkIn || '—'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {item.checkOut || '—'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {item.status === 'Present' && <span className="text-green-400">✅ Present</span>}
                    {item.status === 'Half Day' && <span className="text-yellow-300">🕒 Half Day</span>}
                    {item.status === 'Absent' && <span className="text-red-400">❌ Absent</span>}
                    {item.status === 'Pending' && <span className="text-gray-400">⏳ Pending</span>}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center px-4 py-3 text-white/70">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmpAttendanceTab;