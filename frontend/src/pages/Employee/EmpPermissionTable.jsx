import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PermissionTable = () => {
  const [permissionRequests, setPermissionRequests] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    timeFrom: '',
    timeTo: '',
    reason: '',
  });

  const token = localStorage.getItem('token');

 const fetchPermissions = async () => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/permission/my-requests?month=${selectedMonth}&year=${selectedYear}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setPermissionRequests(res.data);
  } catch (error) {
    toast.error('Failed to fetch permission requests');
  }
};


  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.timeFrom || !formData.timeTo || !formData.reason.trim?.()) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/permission/request', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success(res.data.message || 'Permission request submitted');
      setFormData({ date: '', timeFrom: '', timeTo: '', reason: '' });
      setShowForm(false);
      fetchPermissions();
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to submit permission request');
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [selectedMonth, selectedYear]);

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-semibold text-white whitespace-nowrap">Permission Requests</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md min-w-[140px]"
        >
          Create
        </button>
      </div>

      <div className="flex gap-2 mb-4">
  <select
    value={selectedMonth}
    onChange={e => setSelectedMonth(Number(e.target.value))}
    className="p-2 rounded text-white bg-white/30 appearance-none"
    style={{ colorScheme: 'dark' }} // Ensures white text in box for some browsers
  >
    {Array.from({ length: 12 }, (_, i) => (
      <option
        key={i + 1}
        value={i + 1}
        className="text-black" // Options text black
      >
        {new Date(0, i).toLocaleString('default', { month: 'long' })}
      </option>
    ))}
  </select>
  <select
    value={selectedYear}
    onChange={e => setSelectedYear(Number(e.target.value))}
    className="p-2 rounded text-white bg-white/30 appearance-none"
    style={{ colorScheme: 'dark' }}
  >
    {Array.from({ length: 5 }, (_, i) => {
      const year = new Date().getFullYear() - 2 + i;
      return (
        <option key={year} value={year} className="text-black">
          {year}
        </option>
      );
    })}
  </select>
</div>

      <div className="p-6 bg-white/20 rounded-xl shadow-lg">
        <div className="bg-black/20 backdrop-blur-md rounded-xl shadow-lg overflow-auto">
          <table className="w-full text-white text-sm">
            <thead>
              <tr className="bg-blue-300 text-black uppercase text-left">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time From</th>
                <th className="px-4 py-3">Time To</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {permissionRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-white/70">
                    No permission requests found.
                  </td>
                </tr>
              ) : (
                permissionRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-white/10 transition duration-200">
                    <td className="px-4 py-3 border-t border-white/10">{req.date?.slice(0, 10)}</td>
                    <td className="px-4 py-3 border-t border-white/10">{req.timeFrom}</td>
                    <td className="px-4 py-3 border-t border-white/10">{req.timeTo}</td>
                    <td className="px-4 py-3 border-t border-white/10">{req.reason}</td>
                    <td className="px-4 py-3 border-t border-white/10">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${req.status === 'Pending' ? 'bg-yellow-500/80 text-black' :
                            req.status === 'Approved' ? 'bg-green-500/80 text-white' :
                              req.status === 'Rejected' ? 'bg-red-500/80 text-white' : 'bg-gray-400 text-white'}`}
                      >
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-white/30 p-6 rounded-xl w-full max-w-md sm:max-w-lg text-white shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Request Permission</h2>
            <form onSubmit={handleFormSubmit}>
              <label className="block mb-2 text-sm">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2 mb-4 border rounded bg-white/10 text-white"
                required
              />

              <label className="block mb-2 text-sm">Time From</label>
              <input
                type="time"
                value={formData.timeFrom}
                onChange={(e) => setFormData({ ...formData, timeFrom: e.target.value })}
                className="w-full p-2 mb-4 border rounded bg-white/10 text-white"
                required
              />

              <label className="block mb-2 text-sm">Time To</label>
              <input
                type="time"
                value={formData.timeTo}
                onChange={(e) => setFormData({ ...formData, timeTo: e.target.value })}
                className="w-full p-2 mb-4 border rounded bg-white/10 text-white"
                required
              />

              <label className="block mb-2 text-sm">Reason</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full p-2 mb-4 border rounded bg-white/10 text-white"
                rows="3"
                required
              ></textarea>

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionTable;