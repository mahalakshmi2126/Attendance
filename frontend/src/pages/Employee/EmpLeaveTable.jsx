import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const LeaveTable = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fromdate: '',
    todate: '',
    reason: '',
  });

  const token = localStorage.getItem('token');

  const fetchLeaves = async () => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/leave/my-requests?month=${selectedMonth}&year=${selectedYear}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setLeaveRequests(res.data);
  } catch (error) {
    toast.error('Failed to fetch leave requests');
  }
};


  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log('>>> From Date:', formData.fromdate);
    console.log('>>> To Date:', formData.todate);
    console.log('>>> Reason:', formData.reason);

    if (!formData.fromdate.trim?.() || !formData.reason.trim?.()) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/leave/request',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success(res.data.message || 'Leave request submitted');
      setFormData({ fromdate: '', todate: '', reason: '' });
      setShowForm(false);
      fetchLeaves();
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to submit leave request');
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [selectedMonth, selectedYear]);

  return (
    <div className="p-4">
      {/* Header Row */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-semibold text-white whitespace-nowrap">Leave Requests</h2>
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

      {/* Table */}
      <div className="p-6 bg-white/20 rounded-xl shadow-lg">
        <div className="bg-black/20 backdrop-blur-md rounded-xl shadow-lg overflow-auto">
          <table className="w-full text-white text-sm">
            <thead>
              <tr className="bg-blue-300 text-black uppercase text-left">
               <th className="px-4 py-3">From Date</th>
                <th className="px-4 py-3">To Date</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-white/70">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                leaveRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-white/10 transition duration-200">
                    <td className="px-4 py-3 border-t border-white/10">{req.fromdate?.slice(0, 10)}</td>
                    <td className="px-4 py-3 border-t border-white/10">{req.todate?.slice(0, 10) || '-'}</td>
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
            <h2 className="text-xl font-bold mb-4">Request Leave</h2>
            <form onSubmit={handleFormSubmit}>
              <label className="block mb-2 text-sm">From Date</label>
              <input
                type="date"
                value={formData.fromdate || ''}
                onChange={(e) => setFormData({ ...formData, fromdate: e.target.value })}
                className="w-full p-2 mb-4 border rounded bg-white/10 text-white"
                required
              />

              <label className="block mb-2 text-sm">To Date (Optional)</label>
              <input
                type="date"
                value={formData.todate || ''}
                onChange={(e) => setFormData({ ...formData, todate: e.target.value })}
                className="w-full p-2 mb-4 border rounded bg-white/10 text-white"
              />

              <label className="block mb-2 text-sm">Reason</label>
              <textarea
                value={formData.reason || ''}
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

export default LeaveTable;