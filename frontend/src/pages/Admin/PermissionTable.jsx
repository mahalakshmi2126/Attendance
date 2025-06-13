import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PermissionTable = () => {
  const [permissionRequests, setPermissionRequests] = useState([]);
  const token = localStorage.getItem('token');

  const fetchPermissions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/permission/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPermissionRequests(res.data);
    } catch (err) {
      toast.error('Failed to fetch permission requests');
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/permission/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Permission approved');
      // Remove from list immediately
      setPermissionRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (err) {
      toast.error('Failed to approve permission');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/permission/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Permission rejected');
      // Remove from list immediately
      setPermissionRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (err) {
      toast.error('Failed to reject permission');
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white/20 rounded-xl shadow-lg mx-2 sm:mx-0">
      <div className="overflow-x-auto">
        <table className="w-full table-auto shadow bg-black/20 text-white min-w-[600px] sm:min-w-full">
          <thead>
            <tr className="bg-blue-300 text-black text-left">
              <th className="p-2 border">Employee</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">From</th>
              <th className="p-2 border">To</th>
              <th className="p-2 border">Reason</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {permissionRequests.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-white">
                  No pending permission requests found.
                </td>
              </tr>
            ) : (
              permissionRequests.map((req) => (
                <tr key={req._id} className="hover:bg-white/10">
                  <td className="p-2 border">{req.fullName}</td>
                  <td className="p-2 border">{req.date?.slice(0, 10)}</td>
                  <td className="p-2 border">{req.timeFrom}</td>
                  <td className="p-2 border">{req.timeTo}</td>
                  <td className="p-2 border">{req.reason}</td>
                  <td className="p-2 border">{req.status}</td>
                  <td className="p-2 border whitespace-nowrap">
                    <button
                      onClick={() => handleApprove(req._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionTable;